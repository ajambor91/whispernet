package net.whisper.wssession.session.services;


import net.whisper.wssession.core.coordinatos.ClientSessionCoordinator;
import net.whisper.wssession.core.enums.EKafkaMessageTypes;
import net.whisper.wssession.core.enums.EPGPSessionType;
import net.whisper.wssession.session.kafka.SessionKafkaProducer;
import net.whisper.wssession.session.managers.SessionManager;
import net.whisper.wssession.session.models.PeerClient;
import net.whisper.wssession.session.models.PeerSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
public class SessionService {
    private final SessionManager sessionManager;
    private final SessionKafkaProducer sessionKafkaProducer;
    private final ClientSessionCoordinator clientSessionCoordinator;
    private final Logger logger;

    @Autowired
    public SessionService(@Lazy ClientSessionCoordinator clientSessionCoordinator,
                          SessionManager sessionManager,
                          SessionKafkaProducer sessionKafkaProducer) {
        this.sessionManager = sessionManager;
        this.clientSessionCoordinator = clientSessionCoordinator;
        this.sessionKafkaProducer = sessionKafkaProducer;
        this.logger = LoggerFactory.getLogger(SessionService.class);
    }

    public void processNewClient(PeerClient peerClient) {
        if (peerClient == null) {
            throw new IllegalArgumentException("PeerClient for new client processing cannot be null");
        }
        logger.debug("Passing new peerClient to sessionManager, userToken={}", peerClient.getUserToken());
        PeerSession peerSession = this.sessionManager.createSession(peerClient);
        logger.debug("Peer new was initialized new session successfully, userToken={}, sessionToken={}", peerClient.getUserToken(), peerSession.getSessionToken());
        this.conditionallySendRunSignalWebSocket(peerClient, peerSession, EKafkaMessageTypes.NEW_SESSION);
        this.clientSessionCoordinator.returnDataToUser(peerSession, peerClient);
    }

    public void processJoinClient(String sessionToken, PeerClient peerClient) {
        if (sessionToken == null) {
            throw new IllegalArgumentException("sessionToken for joining client processing cannot be null");
        }

        if (peerClient == null) {
            throw new IllegalArgumentException("PeerClient for joining client processing cannot be null");
        }
        logger.debug("Passing joining peerClient to sessionManager, userToken={}", peerClient.getUserToken());
        PeerSession peerSession = this.sessionManager.addPeerToExistingSession(sessionToken, peerClient);
        logger.debug("Peer joining was added to session successfully, userToken={}, sessionToken={}", peerClient.getUserToken(), sessionToken);
        this.conditionallySendRunSignalWebSocket(peerClient, peerSession, EKafkaMessageTypes.ADD_CLIENT_TO_SESSION);
        this.clientSessionCoordinator.returnDataToUser(peerSession, peerClient);
    }

    public void processUpdateClient(String sessionToken, PeerClient peerClient, boolean requestReturn) {
        if (sessionToken == null) {
            throw new IllegalArgumentException("sessionToken for update client processing cannot be null");
        }

        if (peerClient == null) {
            throw new IllegalArgumentException("PeerClient for update client processing cannot be null");
        }
        logger.debug("Passing updating peerClient to sessionManager, userToken={}", peerClient.getUserToken());
        PeerSession peerSession = this.sessionManager.updatePeerSession(sessionToken, peerClient);
        logger.debug("Peer update was updated successfully, userToken={}, sessionToken={}", peerClient.getUserToken(), sessionToken);
        this.conditionallySendRunSignalWebSocket(peerClient, peerSession, EKafkaMessageTypes.ADD_CLIENT_TO_SESSION);
        if (requestReturn) {
            logger.debug("Peer update is returning to Session, userToken={}, sessionToken={}", peerClient.getUserToken(), sessionToken);
            this.clientSessionCoordinator.returnDataToUser(peerSession, peerClient);
        }
    }

    public void updateSession(PeerSession peerSession) {
        if (peerSession == null) {
            throw new IllegalArgumentException("PeerSession cannot be null when updating session");
        }
        this.sessionManager.updateSession(peerSession);
    }

    public void removeClientFromSession(PeerSession peerSession) {
        if (peerSession == null) {
            throw new IllegalArgumentException("PeerSession cannot be null when removing peer");

        }
        this.sessionManager.removeClientFromSession(peerSession);
    }

    private void conditionallySendRunSignalWebSocket(PeerClient peerClient, PeerSession peerSession, EKafkaMessageTypes kafkaMessageTypes) {
        if (peerSession.getPgpSessionType() == EPGPSessionType.UNSIGNED || peerClient.getSessionType() == EPGPSessionType.SIGNED) {
            logger.debug("Peer sending to Signal Server, userToken={}, sessionToken={}", peerClient.getUserToken(), peerSession.getSessionToken());
            this.sessionKafkaProducer.sendSession(peerSession, kafkaMessageTypes);

        }
    }

}
