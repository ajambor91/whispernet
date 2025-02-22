package net.whisper.sessionGateway.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import net.whisper.sessionGateway.enums.EKafkaMessageTypes;
import net.whisper.sessionGateway.enums.EPGPSessionType;
import net.whisper.sessionGateway.interfaces.ISignedClient;
import net.whisper.sessionGateway.managers.ClientManager;
import net.whisper.sessionGateway.models.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class SessionService {


    private final Logger logger;
    private final ClientManager clientManager;
    private final AuthService authService;
    private final KafkaService kafkaService;

    @Autowired
    private SessionService(KafkaService kafkaService, ClientManager clientManager, AuthService authService) {
        this.kafkaService = kafkaService;
        this.clientManager = clientManager;
        this.authService = authService;
        this.logger = LoggerFactory.getLogger(SessionService.class);
    }

    public IncomingClient createClient() throws InterruptedException, JsonProcessingException {
        ClientWithoutSession client = this.clientManager.setupNewClient();
        this.kafkaService.sendClient(client, EKafkaMessageTypes.NEW_CLIENT);
        return this.kafkaService.waitForMessage(client, 5);

    }

    public IncomingClient createNextClientSession(String sessionToken) throws InterruptedException, JsonProcessingException {
        Client client = this.clientManager.createJoinClient(sessionToken);
        this.kafkaService.sendClient(client, EKafkaMessageTypes.ADD_CLIENT);
        IncomingClient incomingClient = this.kafkaService.waitForMessage(client, 5);
        logger.info("Received incomming client userToken={}, with parner token={}", incomingClient.getUserToken());
        if (
                incomingClient.getSessionType() == EPGPSessionType.CHECK_RESPONDER ||
                        incomingClient.getSessionType() == EPGPSessionType.SIGNED
        ) {
            List<Partner> partners = incomingClient.getPartners();
            this.authService.checkPartners(partners);
            List<Partner> checkedPartners = this.authService.waitForPartnersConfirmed(5);
            incomingClient.setPartners(checkedPartners);
        }

        return incomingClient;
    }

    public IncomingClient createSignClient(Map<String, String> headers) throws InterruptedException, JsonProcessingException, SecurityException {
        ClientWithoutSession client = this.clientManager.setupNewClient();
        if (headers.get("username") == null || headers.get("username").isEmpty()) {
            logger.error("Throw error while creating signed session: Username not found");
            throw new NoSuchElementException("Username not found");
        }
        if (headers.get("authorization") == null || headers.get("authorization").isEmpty()) {
            logger.error("Throw error while creating signed session: Authorization token not found");
            throw new NoSuchElementException("Authorization token not found");
        }
        ISignedClient signedClient = new SignedCheckingClient(client, headers.get("authorization"), headers.get("username"));

        this.authService.checkClient(signedClient);
        logger.info("Send client to veirifaction, userToken={}, username={}", signedClient.getUserToken(), signedClient.getUsername());
        ISignedClient checkedClient = this.authService.waitForConfirmed(signedClient, 5);

        if (checkedClient == null || checkedClient.getSessionType() == EPGPSessionType.UNSIGNED) {
            logger.error("Throw error while creating signed session: Client unauthorized");
            throw new SecurityException("Client unauthorized");
        }
        client.setUsername(signedClient.getUsername());
        client.setSessionType(EPGPSessionType.CHECK_RESPONDER);
        this.kafkaService.sendClient(client, EKafkaMessageTypes.NEW_CLIENT);
        return this.kafkaService.waitForMessage(client, 5);


    }
}