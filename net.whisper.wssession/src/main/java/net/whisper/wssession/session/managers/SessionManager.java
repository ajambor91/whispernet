package net.whisper.wssession.session.managers;

import net.whisper.wssession.session.models.PeerClient;
import net.whisper.wssession.session.models.PeerSession;
import net.whisper.wssession.session.repositories.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class SessionManager {

    private final SessionRepository sessionRepository;
    private final Logger logger;
    @Autowired
    public SessionManager(SessionRepository sessionRepository) {
        this.logger = LoggerFactory.getLogger(SessionManager.class);
        this.sessionRepository = sessionRepository;
    }


    public PeerSession createSession(PeerClient peerClient) {
        return this.setupPeerSession(peerClient);
    }

    public PeerSession addPeerToExistingSession(String sessionToken, PeerClient peerClient) {
        PeerSession peerSession = this.sessionRepository.getSession(sessionToken);
        peerSession.addPeerClient(peerClient);
        this.sessionRepository.saveSession(peerSession.getSessionToken(), peerSession);
        logger.info("Peer added to session, userToken={}, sessionToken={}", peerClient.getUserToken(), peerSession.getSessionToken());
        return peerSession;
    }

    private PeerSession setupPeerSession(PeerClient peerClient) {
        String sessionToken = UUID.randomUUID().toString();
        String secretKey = this.createAESSecret();
        PeerSession peerSession = new PeerSession(sessionToken, secretKey);
        logger.info("New session created, sessionToken={}", peerSession.getSessionToken());
        peerSession.addPeerClient(peerClient);
        this.sessionRepository.saveSession(peerSession.getSessionToken(), peerSession);
        logger.info("Peer added to session, userToken={}, sessionToken={}", peerClient.getUserToken(), peerSession.getSessionToken());
        return peerSession;

    }

    public void removeClientFromSession(PeerSession peerSession) {
        PeerSession existingSession = this.sessionRepository.getSession(peerSession.getSessionToken());
        List<PeerClient> peers = existingSession.getPeerClients();
        peerSession.getPeerClients().forEach(peer -> {
            int index = peers.indexOf(peer);
            if (index != -1) {
                peers.remove(index);
            } else {
                logger.warn("Peer cannot remove - peer not found in existing session, sessionToken={}, userToken={}", peerSession.getSessionToken(), peer.getUserToken());
            }
        });
        existingSession.setSessionStatus(peerSession.getSessionStatus());
        this.sessionRepository.saveSession(existingSession.getSessionToken(), existingSession);
        logger.info("Peer has successfullly removed from session, sessionToken={}", peerSession.getSessionToken());
    }

    public void updateSession(PeerSession peerSession) {
        PeerSession existingSession = this.sessionRepository.getSession(peerSession.getSessionToken());
        List<PeerClient> peers = existingSession.getPeerClients();
        peerSession.getPeerClients().forEach(peer -> {
            int index = peers.indexOf(peer);
            if (index != -1) {
                PeerClient foundPeer = peers.get(index);
                foundPeer.setClientConnectionStatus(peer.getClientConnectionStatus());
            } else {
                logger.warn("Peer cannot update - peer not found in existing session, sessionToken={}, userToken={}", peerSession.getSessionToken(), peer.getUserToken());
            }
        });
        existingSession.setSessionStatus(peerSession.getSessionStatus());
        this.sessionRepository.saveSession(existingSession.getSessionToken(), existingSession);
        logger.info("Session has successfullly updated, sessionToken={}", peerSession.getSessionToken());
    }

    private String createAESSecret(){
        String AESToken = null;
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
            keyGenerator.init(256);
            SecretKey secretKey = keyGenerator.generateKey();
            AESToken = Base64.getEncoder().encodeToString(secretKey.getEncoded());
            logger.info("AES Token created");
            return AESToken;

        } catch (NoSuchAlgorithmException e) {
            logger.error("Cannot create AES Token, message={}", e.getMessage());
            throw new RuntimeException("Cannot create AES Token");
        }
    }
}
