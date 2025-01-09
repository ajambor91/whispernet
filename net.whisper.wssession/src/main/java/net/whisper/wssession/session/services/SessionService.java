package net.whisper.wssession.session.services;


import net.whisper.wssession.core.coordinatos.ClientSessionCoordinator;
import net.whisper.wssession.core.enums.EKafkaMessageTypes;
import net.whisper.wssession.session.managers.SessionManager;
import net.whisper.wssession.session.kafka.SessionKafkaProducer;
import net.whisper.wssession.session.models.PeerClient;
import net.whisper.wssession.session.models.PeerSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
            if(peerClient == null) {
                throw new IllegalArgumentException("PeerClient for new client processing cannot be null");
            }
            PeerSession peerSession = this.sessionManager.createSession(peerClient);
            this.sessionKafkaProducer.sendSession(peerSession, EKafkaMessageTypes.NEW_SESSION);
            this.clientSessionCoordinator.returnDataToUser(peerSession, peerClient);


    }

    public void processJoinClient(String sessionToken, PeerClient peerClient) {
            if (sessionToken == null) {
                throw new IllegalArgumentException("sessionToken for joining client processing cannot be null");
            }

            if (peerClient == null) {
                throw new IllegalArgumentException("PeerClient for joining client processing cannot be null");
            }

            PeerSession peerSession = this.sessionManager.addPeerToExistingSession(sessionToken, peerClient);
            this.sessionKafkaProducer.sendSession(peerSession, EKafkaMessageTypes.ADD_CLIENT_TO_SESSION);
            this.clientSessionCoordinator.returnDataToUser(peerSession, peerClient);
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

}
