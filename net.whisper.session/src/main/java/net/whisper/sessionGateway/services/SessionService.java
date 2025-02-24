package net.whisper.sessionGateway.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import net.whisper.sessionGateway.dto.requests.PeerState;
import net.whisper.sessionGateway.enums.EKafkaMessageTypes;
import net.whisper.sessionGateway.enums.EPGPSessionType;
import net.whisper.sessionGateway.exceptions.UserUnauthorizationException;
import net.whisper.sessionGateway.interfaces.IBaseClient;
import net.whisper.sessionGateway.interfaces.IChecker;
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
        logger.info("Created SessionService");
    }

    public IncomingClient createClient() throws InterruptedException, JsonProcessingException {
        logger.info("Creating new unsigned client");
        ClientWithoutSession client = this.clientManager.setupNewClient();
        logger.debug("Unsigned new client created");
        this.kafkaService.sendMessage(client, EKafkaMessageTypes.NEW_CLIENT);
        logger.debug("Sent new client kafka message, waiting for response");
        return this.kafkaService.waitForMessage(client, 5);

    }

    public IncomingClient createNextClientSession(String sessionToken, Map<String, String> headers) throws InterruptedException, JsonProcessingException {
        logger.info("Creating joining client, to session={}", sessionToken);
        IBaseClient client = this.clientManager.createJoinClient(sessionToken);
        logger.debug("Created joinging client, sessionToken={}, userToken={}", sessionToken, client.getUserToken());
        this.kafkaService.sendMessage(client, EKafkaMessageTypes.ADD_CLIENT);
        logger.debug("Sent joining client kafka message, waiting for response, sessionToken={}, userToken={}", sessionToken, client.getUserToken());
        IncomingClient incomingClient = this.kafkaService.waitForMessage(client, 5);
        logger.debug("Received incomming joining client, sessionToken={}, userToken={}", sessionToken, incomingClient.getUserToken());
        if (
                incomingClient.getSessionType() == EPGPSessionType.CHECK_RESPONDER
        ) {
            logger.info("Signed session, checking responder, sessionToken={}, userToken={}", incomingClient.getSessionToken(), incomingClient.getUserToken());
            ISignedClient signedClient = null;
            try {
                logger.debug("Verifying peer, sessionToken={}, userToken={}", incomingClient.getSessionToken(), incomingClient.getUserToken());
                signedClient = this.checkClientIsVerified(incomingClient, headers);
            } catch (InterruptedException | JsonProcessingException exception) {
                this.logger.error(exception.getMessage());
            }
            if (signedClient.getSessionType() == EPGPSessionType.VERIFIED) {
                logger.info("Client responder verified successfully, sessionToken={}, userToken={}", incomingClient.getSessionToken(), incomingClient.getUserToken());
                client.setUsername(signedClient.getUsername());
                client.setSessionType(EPGPSessionType.VERIFIED);
                logger.debug("Sending update joining peer request, sessionToken={}, userToken={}", incomingClient.getSessionToken(), incomingClient.getUserToken());
                this.kafkaService.sendMessage(client, EKafkaMessageTypes.UPDATE_CLIENT);
                List<Partner> partners = incomingClient.getPartners();
                logger.debug("Creating checker for joining client, sessionToken={}, userToken={}", incomingClient.getSessionToken(), incomingClient.getUserToken());
                IChecker checker = new Checker(incomingClient, partners);
                logger.debug("Checker joining client created, sessionToken={}, userToken={}", incomingClient.getSessionToken(), incomingClient.getUserToken());
                logger.debug("Sending joining client, check partners request to Security, sessionToken={}, userToken={}", incomingClient.getSessionToken(), incomingClient.getUserToken());
                this.authService.checkPartners(checker);
                checker = this.authService.waitForPartnersConfirmed(checker, 5);
                logger.debug("Received check joining client partners response sessionToken={}, userToken={}", incomingClient.getSessionToken(), incomingClient.getUserToken());
                incomingClient.setPartners(checker.getPartners());
            }

        }
        logger.info("Returning incomming client, sessionToken={}, userToken={}", incomingClient.getSessionToken(), incomingClient.getUserToken());
        return incomingClient;
    }

    public IncomingClient updateClient(String userToken, String sessionToken, Map<String, String> headers, PeerState peerState) throws InterruptedException, JsonProcessingException {
        logger.info("Updating client, to session={}, userToken={}", sessionToken, userToken);

        if (userToken == null) {
            throw new NoSuchElementException("User token not found");
        }

        IBaseClient client = this.clientManager.createUpdateClient(userToken, peerState);
        logger.debug("Created update client, sessionToken={}, userToken={}", sessionToken, client.getUserToken());
        IncomingClient incomingClient = null;
        logger.info("Received update client userToken={} status={}", userToken, client.getSessionType().getSessionPGPStatus());
        if (
                client.getSessionType() == EPGPSessionType.CHECK_RESPONDER
        ) {
            logger.info("Signed session, when updating peer, checking responder, sessionToken={}, userToken={}", sessionToken, userToken);
            ISignedClient signedClient = null;
            try {
                signedClient = this.checkClientIsVerified(client, headers);
                logger.info("Received signed client from update client userToken={} status={}", signedClient.getUsername(), signedClient.getSessionType());

            } catch (InterruptedException | JsonProcessingException exception) {
                this.logger.error(exception.getMessage());
            }
            if (signedClient.getSessionType() == EPGPSessionType.VERIFIED) {
                logger.info("Updating client responder verified successfully, sessionToken={}, userToken={}", sessionToken, userToken);
                client.setUsername(signedClient.getUsername());
                client.setSessionType(EPGPSessionType.VERIFIED);
                logger.debug("Sending update peer request, sessionToken={}, userToken={}", sessionToken, userToken);
                this.kafkaService.sendMessage(client, EKafkaMessageTypes.UPDATE_LOGIN_CLIENT);
                incomingClient = this.kafkaService.waitForMessage(client, 5);
                if (incomingClient == null) {
                    logger.error("Cannot found client to update in passed session, sessionToken={}, userToken={}", sessionToken, userToken);
                    throw new SecurityException("Cannot found client to update in passed session");
                }
                logger.info("USER ID UPDATING {}", incomingClient.getUserId());
                List<Partner> partners = incomingClient.getPartners();
                logger.debug("Creating checker for update client, sessionToken={}, userToken={}", incomingClient.getSessionToken(), incomingClient.getUserToken());
                IChecker checker = new Checker(incomingClient, partners);
                logger.debug("Checker update client created, sessionToken={}, userToken={}", incomingClient.getSessionToken(), incomingClient.getUserToken());
                logger.debug("Sending update client, check partners request to Security, sessionToken={}, userToken={}", incomingClient.getSessionToken(), incomingClient.getUserToken());
                this.authService.checkPartners(checker);
                checker = this.authService.waitForPartnersConfirmed(checker, 5);
                logger.debug("Received check updating client partners response sessionToken={}, userToken={}", incomingClient.getSessionToken(), incomingClient.getUserToken());
                incomingClient.setPartners(checker.getPartners());
            }
        }
        logger.info("Returning update client");
        return incomingClient;
    }

    public IncomingClient createSignClient(Map<String, String> headers) throws InterruptedException, JsonProcessingException, SecurityException {
        logger.info("Creating new signed client");
        ClientWithoutSession client = this.clientManager.setupNewClient();
        logger.debug("Signed new client created");
        ISignedClient signedClient = null;
        try {
            logger.debug("Checking signed client");

            signedClient = this.checkClientIsVerified(client, headers);
        } catch (InterruptedException | JsonProcessingException exception) {
            this.logger.error(exception.getMessage());
        }

        if (signedClient == null || signedClient.getSessionType() == EPGPSessionType.UNSIGNED) {
            logger.error("Throw error while creating signed session: Client unauthorized");
            throw new SecurityException("Client unauthorized");
        }
        logger.debug("Signed client verified successfully");
        client.setUsername(signedClient.getUsername());
        client.setSessionType(EPGPSessionType.CHECK_RESPONDER);
        this.kafkaService.sendMessage(client, EKafkaMessageTypes.NEW_CLIENT);
        logger.debug("Sent new client kafka message, waiting for response");
        return this.kafkaService.waitForMessage(client, 5);
    }

    private ISignedClient checkClientIsVerified(IBaseClient client, Map<String, String> headers) throws InterruptedException, JsonProcessingException {
        if (headers.get("username") == null || headers.get("username").isEmpty()) {
            logger.error("Throw error while creating signed session: Username not found");
            throw new UserUnauthorizationException("Username not found", client);
        }
        if (headers.get("authorization") == null || headers.get("authorization").isEmpty()) {
            logger.error("Throw error while creating signed session: Authorization token not found");
            throw new UserUnauthorizationException("UAuthorization token not found", client);
        }
        ISignedClient signedClient = new SignedCheckingClient(client, headers.get("authorization"), headers.get("username"));
        this.authService.checkClient(signedClient);
        logger.info("Send client to verification, userToken={}, username={}", signedClient.getUserToken(), signedClient.getUsername());
        return this.authService.waitForConfirmed(signedClient, 5);
    }
}