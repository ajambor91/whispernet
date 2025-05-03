package net.whisper.session.Clients.Services;

import net.whisper.session.Clients.Factories.ClientFactory;
import net.whisper.session.Clients.Models.Client;
import net.whisper.session.Clients.Models.ClientWithoutSession;
import net.whisper.session.Core.Coordinatos.ClientSessionCoordinator;
import net.whisper.session.Session.Models.PeerClient;
import net.whisper.session.Clients.Kafka.ClientsKafkaProducer;

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
        this.logger.info("Processing new client, userToken={}", clientWithoutSession.getUserToken());
        PeerClient peerClient = ClientFactory.createPeerClient(clientWithoutSession);
        this.logger.debug("Create new peerClient with userToken={}, and username={}", peerClient.getUserToken(), peerClient.getUsername());
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

    public void updatePeer(Client client, boolean requestReturn) {
        if (client == null) {
            throw new IllegalArgumentException("Client cannot be null");
        }
        PeerClient peerClient = ClientFactory.createPeerClient(client);
        this.clientSessionCoordinator.updatePeerOrSession(client.getSessionToken(), peerClient, requestReturn);
        logger.info("Pass update client to coordinator, userToken={}, sessionToken={}", client.getUserToken(), client.getSessionToken());
    }

    public void returnDataToUser(Client client) {
        try {
            this.clientsKafkaProducer.returnNewUser(client);
        } catch (Exception e) {
            logger.error("ReturnDataToUser, sessionToken={}, userToken={}, message={}", client.getSessionToken(), client.getUserToken(), e.getMessage());
        }
    }


}
