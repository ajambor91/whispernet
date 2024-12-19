package net.whisper.wssession.session.services;


import net.whisper.wssession.core.coordinatos.ClientSessionCoordinator;
import net.whisper.wssession.core.enums.EKafkaMessageTypes;
import net.whisper.wssession.managers.SessionManager;
import net.whisper.wssession.session.kafka.SessionKafkaProducer;
import net.whisper.wssession.session.models.PeerClient;
import net.whisper.wssession.session.models.PeerSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
public class SessionService {
    private final SessionManager sessionManager;
    private final SessionKafkaProducer sessionKafkaProducer;
    private final ClientSessionCoordinator clientSessionCoordinator;

    @Autowired
    public SessionService(@Lazy ClientSessionCoordinator clientSessionCoordinator,
                          SessionManager sessionManager,
                          SessionKafkaProducer sessionKafkaProducer) {
        this.sessionManager = sessionManager;
        this.clientSessionCoordinator = clientSessionCoordinator;
        this.sessionKafkaProducer = sessionKafkaProducer;
    }

    public void processNewClient(PeerClient peerClient) {
        try {
            PeerSession peerSession = this.sessionManager.createSession(peerClient);
            this.sessionKafkaProducer.sendSession(peerSession, EKafkaMessageTypes.NEW_SESSION);
            this.clientSessionCoordinator.returnDataToUser(peerSession, peerClient);
        } catch (Exception e) {
            System.out.println(e);
        }

    }

    public void processJoinClient(String sessionToken, PeerClient peerClient) {
        try {
            PeerSession peerSession = this.sessionManager.addPeerToExistingSession(sessionToken, peerClient);
            this.sessionKafkaProducer.sendSession(peerSession, EKafkaMessageTypes.ADD_CLIENT_TO_SESSION);
            this.clientSessionCoordinator.returnDataToUser(peerSession, peerClient);
        } catch (Exception e) {
            System.out.println(e);
        }

    }
}
