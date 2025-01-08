package net.whisper.wssession.clients.services;

import net.whisper.wssession.clients.factories.ClientFactory;
import net.whisper.wssession.clients.kafka.ClientsKafkaProducer;
import net.whisper.wssession.clients.models.Client;
import net.whisper.wssession.clients.models.ClientWithoutSession;
import net.whisper.wssession.core.coordinatos.ClientSessionCoordinator;
import net.whisper.wssession.session.models.PeerClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
public class ClientsService {

    private final Logger logger;
    private final ClientsKafkaProducer clientsKafkaProducer;
    private final ClientSessionCoordinator clientSessionCoordinator;

    @Autowired
    public ClientsService(@Lazy ClientSessionCoordinator clientSessionCoordinator, ClientsKafkaProducer clientsKafkaProducer) {
        this.clientsKafkaProducer = clientsKafkaProducer;
        this.clientSessionCoordinator = clientSessionCoordinator;
        this.logger = LoggerFactory.getLogger(ClientsService.class);
    }

    public void processNewClient(ClientWithoutSession clientWithoutSession) {
        if (clientWithoutSession == null) {
            throw new IllegalArgumentException("ClientWithoutSession cannot be null");
        }

        PeerClient peerClient = ClientFactory.createPeerClient(clientWithoutSession);
        this.clientSessionCoordinator.processClientWithoutSession(peerClient);
        logger.info("Pass new user to coordinator, userToken={}", peerClient.getUserToken());
    }

    public void processJoiningClient(Client client) {
        if (client == null) {
            throw new IllegalArgumentException("Client cannot be null");
        }
        PeerClient peerClient = ClientFactory.createPeerClient(client);
        this.clientSessionCoordinator.processClient(client.getSessionToken(), peerClient);
        logger.info("Pass joining client to coordinator, userToken={}, sessionToken={}", client.getUserToken(), client.getSessionToken());
    }

    public void returnDataToUser(Client client) {
        try {
            this.clientsKafkaProducer.returnNewUser(client);
        } catch (Exception e) {
            logger.error("ReturnDataToUser, sessionToken={}, userToken={}, message={}", client.getSessionToken(), client.getUserToken(), e.getMessage());
        }
    }


}
