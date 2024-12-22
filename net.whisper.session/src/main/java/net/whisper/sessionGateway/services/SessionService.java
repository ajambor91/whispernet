package net.whisper.sessionGateway.services;

import net.whisper.sessionGateway.managers.ClientManager;
import net.whisper.sessionGateway.models.Client;
import net.whisper.sessionGateway.models.ClientWithoutSession;
import net.whisper.sessionGateway.models.IncomingClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SessionService {


    private final Logger logger;
    private final ClientManager clientManager;
    private final KafkaService kafkaService;

    @Autowired
    private SessionService(KafkaService kafkaService, ClientManager clientManager) {
        this.kafkaService = kafkaService;
        this.clientManager = clientManager;
        this.logger = LoggerFactory.getLogger(SessionService.class);
    }

    public IncomingClient createClient() {
        try {

            ClientWithoutSession client = this.clientManager.setupNewClient();
            this.kafkaService.sendNewClient(client);
            return this.kafkaService.waitForMessage(client, 5);
        } catch (java.lang.Exception e) {
            throw new RuntimeException(e);
        }

    }

    public IncomingClient createNextClientSession(String sessionToken) {
        try {
            Client client = this.clientManager.createJoinClient(sessionToken);
            this.kafkaService.sendJoinlient(client);

            return this.kafkaService.waitForMessage(client, 5);
        } catch (java.lang.Exception e) {
            throw new RuntimeException(e);
        }
    }
}