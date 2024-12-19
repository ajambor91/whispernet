package net.whisper.wssession.managers;

import net.whisper.wssession.session.models.PeerClient;
import net.whisper.wssession.session.models.PeerSession;
import net.whisper.wssession.session.repositories.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SessionManager {

    private final SessionRepository sessionRepository;

    @Autowired
    public SessionManager(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }


    public PeerSession createSession(PeerClient peerClient) {
        return this.setupPeerSession(peerClient);
    }

    public PeerSession addPeerToExistingSession(String sessionToken, PeerClient peerClient) {
        PeerSession peerSession = this.sessionRepository.getSession(sessionToken);
        peerSession.addPeerClient(peerClient);
        this.sessionRepository.saveSession(peerSession.getSessionToken(), peerSession);
        return peerSession;
    }

    private PeerSession setupPeerSession(PeerClient peerClient) {
        String sessionToken = UUID.randomUUID().toString();
        PeerSession peerSession = new PeerSession(sessionToken);
        peerSession.addPeerClient(peerClient);
        this.sessionRepository.saveSession(peerSession.getSessionToken(), peerSession);
        return peerSession;

    }
}
