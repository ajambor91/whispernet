package net.whisper.session.Session.Services;



import net.whisper.session.Core.Coordinatos.ClientSessionCoordinator;
import net.whisper.session.Core.Enums.EKafkaMessageTypes;
import net.whisper.session.Core.Enums.EPGPSessionType;
import net.whisper.session.Session.Kafka.SessionKafkaProducer;
import net.whisper.session.Session.Managers.SessionManager;
import net.whisper.session.Session.Models.ApprovingSession;
import net.whisper.session.Session.Models.PeerClient;
import net.whisper.session.Session.Models.PeerSession;
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
        logger.debug("Peer new was initialized new Session successfully, userToken={}, sessionToken={}", peerClient.getUserToken(), peerSession.getSessionToken());
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
        logger.debug("Peer joining was added to Session successfully, userToken={}, sessionToken={}", peerClient.getUserToken(), sessionToken);
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
            throw new IllegalArgumentException("PeerSession cannot be null when updating Session");
        }
        this.sessionManager.updateSession(peerSession);
    }

    public void acceptSession(ApprovingSession approvingSession) {
        PeerSession peerSession = this.sessionManager.acceptSession(approvingSession);
        this.sessionKafkaProducer.sendSession(peerSession, EKafkaMessageTypes.NEW_SESSION);
    }

    public void removeSession(ApprovingSession approvingSession) {
        this.sessionManager.removeSession(approvingSession);
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
