package net.whisper.wssession.clients.services;

import net.whisper.wssession.clients.factories.ClientFactory;
import net.whisper.wssession.clients.kafka.ClientsKafkaProducer;
import net.whisper.wssession.clients.models.Client;
import net.whisper.wssession.clients.templates.KafkaClientMessage;
import net.whisper.wssession.clients.templates.KafkaClientWithoutSessionMessage;
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

    public void processNewClient(KafkaClientWithoutSessionMessage clientTemplate) {
        PeerClient clientWithoutSession = ClientFactory.createPeerClient(clientTemplate);
        this.clientSessionCoordinator.processClientWithoutSession(clientWithoutSession);
        logger.info("Pass new user to coordinator, userToken={}", clientTemplate.getUserToken());
    }

    public void processJoiningClient(KafkaClientMessage clientTemplate) {
        PeerClient client = ClientFactory.createPeerClient(clientTemplate);
        this.clientSessionCoordinator.processClient(clientTemplate.getSessionToken(), client);
        logger.info("Pass joining client to coordinator, userToken={}, sessionToken={}", client.getUserToken(), clientTemplate.getSessionToken());
    }

    public void returnDataToUser(Client client) {
            this.clientsKafkaProducer.returnNewUser(client);



    }


}
