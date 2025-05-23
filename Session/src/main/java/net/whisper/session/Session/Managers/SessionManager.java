package net.whisper.session.Session.Managers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import net.whisper.session.Core.Enums.EPGPSessionType;
import net.whisper.session.Session.Enums.ESessionStatus;
import net.whisper.session.Session.Models.ApprovingSession;
import net.whisper.session.Session.Models.PeerClient;
import net.whisper.session.Session.Models.PeerSession;
import net.whisper.session.Session.Repositories.SessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.*;

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
        if (peerClient == null) {
            throw new IllegalArgumentException("PeerClient in createSession cannot be null");
        }
        return this.setupPeerSession(peerClient);
    }

    public PeerSession addPeerToExistingSession(String sessionToken, PeerClient peerClient) {
        PeerSession peerSession = this.sessionRepository.getSession(sessionToken);
        try {
            if (peerClient.getSessionType() == EPGPSessionType.SIGNED) {
                peerSession.setPgpSessionType(EPGPSessionType.SIGNED);
            }

            peerClient.setSessionType(peerSession.getPgpSessionType());
            peerSession.addPeerClient(peerClient);
            try {
                logger.info("Existing Session {}", new ObjectMapper().writeValueAsString(peerSession));

            } catch (JsonProcessingException e) {
                logger.info("Cannot parse existing Session");
            }
            this.sessionRepository.saveSession(peerSession.getSessionToken(), peerSession);
            logger.info("Peer added to Session, userToken={}, sessionToken={}", peerClient.getUserToken(), peerSession.getSessionToken());
            return peerSession;
        } catch (IllegalArgumentException e) {
            logger.error(e.getMessage());
            return peerSession;
        }
    }

    public PeerSession updatePeerSession(String sessionToken, PeerClient peerClient) {
        logger.info("Updating peer, userToken={}, sessionToken={}", peerClient.getUserToken(), sessionToken);
        PeerSession peerSession = this.sessionRepository.getSession(sessionToken);
        logger.debug("Fetch Session from Redis, userToken={}, sessionToken={}", peerClient.getUserToken(), peerSession.getSessionToken());

        Iterator<PeerClient> peerClientIterator = peerSession.getPeerClients().iterator();
        PeerClient foundPeer = null;
        while (peerClientIterator.hasNext()) {
            PeerClient peer = peerClientIterator.next();
            if (peer.getUserId().equals(peerClient.getUserId()) || peer.getUserToken().equals(peerClient.getUserToken())) {
                foundPeer = peer;
                logger.debug("Found peer to update, userToken={}, foundPeer={}", peerClient.getUserToken(), foundPeer.getUserToken());
                break;
            }
        }
        if (foundPeer == null) {
            logger.debug("Peer not found userToken={}, sessionToken={}", peerClient.getUserToken(), sessionToken);
            throw new NoSuchElementException("No peer found");
        }
        if (peerSession.getPgpSessionType() == EPGPSessionType.CHECK_RESPONDER && peerClient.getSessionType() == EPGPSessionType.VERIFIED) {
            peerSession.setPgpSessionType(EPGPSessionType.WAITING_FOR_PEER_ACCEPTED);
        }

        peerClient.updatePeer(foundPeer);
        foundPeer.updatePeer(peerClient);
        this.sessionRepository.saveSession(sessionToken, peerSession);
        return peerSession;
    }

    private PeerSession setupPeerSession(PeerClient peerClient) {
        String sessionToken = UUID.randomUUID().toString();
        String secretKey = this.createAESSecret();
        PeerSession peerSession = new PeerSession(sessionToken, secretKey, peerClient.getSessionType());
        logger.info("New Session created, sessionToken={}", peerSession.getSessionToken());
        peerSession.addPeerClient(peerClient);
        try {
            logger.info("New Session {}", new ObjectMapper().writeValueAsString(peerSession));

        } catch (JsonProcessingException e) {
            logger.info("Cannot parse new Session");
        }
        this.sessionRepository.saveSession(peerSession.getSessionToken(), peerSession);
        logger.info("Peer added to Session, userToken={}, sessionToken={}", peerClient.getUserToken(), peerSession.getSessionToken());
        return peerSession;

    }

    public void removeSession(ApprovingSession approvingSession) {
        if (approvingSession == null) {
            throw new IllegalArgumentException("ApprovingSession in remove Session is null");
        }
        this.sessionRepository.deleteSession(approvingSession.getSessionToken());
    }

    public PeerSession acceptSession(ApprovingSession approvingSession) {
        if (approvingSession == null) {
            throw new IllegalArgumentException("ApprovingSession in accepting Session is null");
        }

        PeerSession peerSession = this.sessionRepository.getSession(approvingSession.getSessionToken());

        peerSession.setPgpSessionType(EPGPSessionType.SIGNED);
        peerSession.getPeerClients().forEach(peer -> peer.setSessionType(EPGPSessionType.PEER_ACCEPTED));
        this.sessionRepository.saveSession(approvingSession.getSessionToken(), peerSession);
        return peerSession;
    }


    public void removeClientFromSession(PeerSession peerSession) {
        if (peerSession == null) {
            throw new IllegalArgumentException("PeerSession in remove Session is null");
        }

        if (peerSession.getPeerClients().isEmpty()) {
            throw new NoSuchElementException("Peers to remove list is empty");
        }
        PeerSession existingSession = this.sessionRepository.getSession(peerSession.getSessionToken());
        List<PeerClient> existingPeers = existingSession.getPeerClients();
        List<PeerClient> newPeers = peerSession.getPeerClients();
        Iterator<PeerClient> iterator = newPeers.iterator();
        while (iterator.hasNext()) {
            PeerClient peer = iterator.next();
            PeerClient foundPeer = existingPeers
                    .stream()
                    .filter(existingPeer -> existingPeer.getUserId().equals(peer.getUserId()))
                    .findFirst()
                    .orElseThrow(() -> new NoSuchElementException("Peer to remove doesn't exist"));
            existingPeers.remove(foundPeer);
        }
        existingSession.setSessionStatus(ESessionStatus.INTERRUPTED);
        this.sessionRepository.saveSession(existingSession.getSessionToken(), existingSession);
        logger.info("Peer was successfully removed from Session, sessionToken={}", peerSession.getSessionToken());
    }

    public void updateSession(PeerSession peerSession) {
        if (peerSession == null) {
            throw new IllegalArgumentException("PeerSession cannot be null when updating Session");
        }
        PeerSession existingSession = this.sessionRepository.getSession(peerSession.getSessionToken());
        List<PeerClient> peers = existingSession.getPeerClients();
        peerSession.getPeerClients().forEach(peer -> {
            PeerClient foundPeer = peers.stream()
                    .filter(existingPeer -> existingPeer.getUserId().equals(peer.getUserId()))
                    .findFirst()
                    .orElseThrow(() -> new NoSuchElementException("Peer not found"));
            foundPeer.setClientConnectionStatus(peer.getClientConnectionStatus());
        });
        existingSession.setSessionStatus(peerSession.getSessionStatus());
        this.sessionRepository.saveSession(existingSession.getSessionToken(), existingSession);
        logger.info("Session was successfully updated, sessionToken={}", peerSession.getSessionToken());
    }

    private String createAESSecret() {
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
