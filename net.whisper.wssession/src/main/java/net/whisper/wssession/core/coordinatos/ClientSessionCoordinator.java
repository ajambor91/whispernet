package net.whisper.wssession.core.coordinatos;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.wssession.clients.factories.ClientFactory;
import net.whisper.wssession.clients.models.Client;
import net.whisper.wssession.clients.services.ClientsService;
import net.whisper.wssession.session.models.PeerClient;
import net.whisper.wssession.session.models.PeerSession;
import net.whisper.wssession.session.services.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class ClientSessionCoordinator {

    @Autowired
    private ObjectMapper objectMapper;

    private final ClientsService clientsService;
    private final SessionService sessionService;


    @Autowired()
    public ClientSessionCoordinator(@Lazy ClientsService clientsService, @Lazy SessionService sessionService) {
        this.clientsService = clientsService;
        this.sessionService = sessionService;
    }

    public void processClientWithoutSession(PeerClient newClient) {

        try {
            this.sessionService.processNewClient(newClient);
        } catch (java.lang.Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void processClient(String sessionToken, PeerClient client) {

        try {

            this.sessionService.processJoinClient(sessionToken, client);
        } catch (java.lang.Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void returnDataToUser(PeerSession peerSession, PeerClient peerClient) {
        Client client = ClientFactory.createClientFromPeerSesion(peerSession, peerClient);
        this.clientsService.returnDataToUser(client);
    }


}