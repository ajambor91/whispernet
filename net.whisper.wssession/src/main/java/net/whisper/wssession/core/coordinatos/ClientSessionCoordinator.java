package net.whisper.wssession.core.coordinatos;

import net.whisper.wssession.clients.factories.ClientFactory;
import net.whisper.wssession.clients.models.Client;
import net.whisper.wssession.clients.services.ClientsService;
import net.whisper.wssession.session.models.PeerClient;
import net.whisper.wssession.session.models.PeerSession;
import net.whisper.wssession.session.services.SessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class ClientSessionCoordinator {

    private final ClientsService clientsService;
    private final SessionService sessionService;
    private final Logger logger;

    @Autowired()
    public ClientSessionCoordinator(@Lazy ClientsService clientsService, @Lazy SessionService sessionService) {
        this.clientsService = clientsService;
        this.sessionService = sessionService;
        this.logger = LoggerFactory.getLogger(ClientSessionCoordinator.class);
    }

    public void processClientWithoutSession(PeerClient newClient) {
        if (newClient == null) {
            logger.error("ClientSessionCoordinator:processClientWithoutSession newClient cannot be null");
            return;
        }
        try {
            this.sessionService.processNewClient(newClient);
        } catch (java.lang.Exception e) {
            logger.error("ClientSessionCoordinator:processClientWithoutSession Error with process client without session, userToken={}, errorMessage={}", newClient.getUserToken(), e.getMessage());
        }
    }

    public void processClient(String sessionToken, PeerClient client) {
        if (sessionToken == null) {
            logger.error("ClientSessionCoordinator:processClient sessionToken cannot be null");
            return;
        }
        if (client == null) {
            logger.error("ClientSessionCoordinator:processClient client cannot be null");
            return;
        }
        try {

            this.sessionService.processJoinClient(sessionToken, client);
        } catch (java.lang.Exception e) {
            logger.error("ClientSessionCoordinator:processClient Error with process joining client session, userToken={}, sessionToken={}, errorMessage={}", client.getUserToken(), sessionToken, e.getMessage());
        }
    }

    public void returnDataToUser(PeerSession peerSession, PeerClient peerClient) {
        if (peerSession == null) {
            logger.error("ClientSessionCoordinator:returnDataToUser peerSession cannot be null");
            return;
        }
        if (peerClient == null) {
            logger.error("ClientSessionCoordinator:returnDataToUser peerClient cannot be null");
            return;
        }
        Client client = ClientFactory.createClientFromPeerSesion(peerSession, peerClient);
        this.clientsService.returnDataToUser(client);
    }


}