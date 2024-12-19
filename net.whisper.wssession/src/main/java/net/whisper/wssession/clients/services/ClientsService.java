package net.whisper.wssession.clients.services;

import net.whisper.wssession.clients.factories.ClientFactory;
import net.whisper.wssession.clients.kafka.ClientsKafkaProducer;
import net.whisper.wssession.clients.models.Client;
import net.whisper.wssession.clients.templates.KafkaClientMessage;
import net.whisper.wssession.clients.templates.KafkaClientWithoutSessionMessage;
import net.whisper.wssession.core.coordinatos.ClientSessionCoordinator;
import net.whisper.wssession.session.models.PeerClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
public class ClientsService {


    private final ClientsKafkaProducer clientsKafkaProducer;
    private final ClientSessionCoordinator clientSessionCoordinator;

    @Autowired
    public ClientsService(@Lazy ClientSessionCoordinator clientSessionCoordinator, ClientsKafkaProducer clientsKafkaProducer) {
        this.clientsKafkaProducer = clientsKafkaProducer;
        this.clientSessionCoordinator = clientSessionCoordinator;
    }

    public void processNewClient(KafkaClientWithoutSessionMessage clientTemplate) {
        try {
            PeerClient clientWithoutSession = ClientFactory.createPeerClient(clientTemplate);
            this.clientSessionCoordinator.processClientWithoutSession(clientWithoutSession);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void processJoiningClient(KafkaClientMessage clientTemplate) {
        PeerClient client = ClientFactory.createPeerClient(clientTemplate);
        this.clientSessionCoordinator.processClient(clientTemplate.getSessionToken(), client);
    }

    public void returnDataToUser(Client client) {
        try {
            this.clientsKafkaProducer.returnNewUser(client);

        } catch (Exception e) {
            e.printStackTrace();

        }

    }


}
