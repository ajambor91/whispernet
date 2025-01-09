package net.whisper.wssession.session.managers;

import net.whisper.wssession.clients.enums.EClientConnectionStatus;
import net.whisper.wssession.clients.enums.EPeerRole;
import net.whisper.wssession.session.enums.ESessionStatus;
import net.whisper.wssession.session.models.PeerClient;
import net.whisper.wssession.session.models.PeerSession;
import net.whisper.wssession.session.repositories.SessionRepository;
import net.whisper.wssession.utils.TestFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.util.ReflectionTestUtils;


import java.util.List;
import java.util.NoSuchElementException;

import static net.whisper.wssession.utils.TestFactory.SESSION_TOKEN_JOINER;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
public class SessionManagerTest {
    private final SessionManager sessionManager;

    private PeerSession peerSessionTest;
    private PeerClient newPeerTest;
    private PeerClient joinerPeerTest;
    private String sessionTokenTest;

    @Mock
    private Logger mockLogger;
    @MockBean
    private SessionRepository sessionRepository;

    @Autowired
    public SessionManagerTest(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @BeforeEach
    public void setup() {
        this.peerSessionTest = TestFactory.createPeerSession();
        this.joinerPeerTest = TestFactory.createPeerClientJoiner();
        this.newPeerTest = TestFactory.createPeerClientInitiator();
        this.sessionTokenTest = SESSION_TOKEN_JOINER;
        when(this.sessionRepository.getSession(any(String.class))).thenReturn(this.peerSessionTest);
        ReflectionTestUtils.setField(this.sessionManager, "logger", mockLogger);
    }

    @Test
    @DisplayName("Should create new session - createSession")
    public void createSessionPass() {
        PeerSession testedSession = TestFactory.createEmptyPeerSession();
        when(this.sessionRepository.getSession(any(String.class))).thenReturn(testedSession);
        PeerSession peerSession = this.sessionManager.createSession(this.newPeerTest);
        assertEquals(1, peerSession.getPeerClients().size());
        assertNotNull(peerSession.getSessionToken());
        assertNotNull(peerSession.getSecretKey());
        assertEquals(peerSession.getSessionStatus(), ESessionStatus.CREATED);
        peerSession.getPeerClients().forEach(peer -> {
            assertEquals(this.newPeerTest.getUserId(), peer.getUserId());
            assertEquals(this.newPeerTest.getUserToken(), peer.getUserToken());
            assertEquals(this.newPeerTest.getPeerRole(), peer.getPeerRole());
            assertEquals(this.newPeerTest.getClientConnectionStatus(), peer.getClientConnectionStatus());
        });
        verify(mockLogger).info("AES Token created");
        verify(mockLogger).info(
                eq("New session created, sessionToken={}"),
                any(String.class)
        );
        verify(mockLogger).info(
                eq("Peer added to session, userToken={}, sessionToken={}"),
                eq(this.newPeerTest.getUserToken()),
                any(String.class)
        );    }

    @DisplayName("Should throw illegal argument exception when null - createSession")
    public void createSessionFailWhenPeerClientNull() {
        PeerClient peerClient = null;
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
           this.sessionManager.createSession(peerClient);
        });
        assertEquals("PeerClient in createSession cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Should add peer to existing session - addPeerToExistingSession")
    public void addPeerToExistingSessionPass() {
        PeerSession peerSession = this.sessionManager.addPeerToExistingSession(this.sessionTokenTest, this.joinerPeerTest);
        assertEquals(peerSession.getPeerClients().size(), 2);
        assertEquals(this.sessionTokenTest, peerSession.getSessionToken());
        assertNotNull(peerSession.getSecretKey());
        assertEquals(peerSession.getSessionStatus(), ESessionStatus.CREATED);
        peerSession.getPeerClients().forEach(peer -> {
            assertNotNull(peer.getPeerRole());
            if (peer.getPeerRole() == EPeerRole.INITIATOR) {
                assertEquals(this.newPeerTest.getUserId(), peer.getUserId());
                assertEquals(this.newPeerTest.getUserToken(), peer.getUserToken());
                assertEquals(this.newPeerTest.getPeerRole(), peer.getPeerRole());
                assertEquals(this.newPeerTest.getClientConnectionStatus(), peer.getClientConnectionStatus());
            } else if (peer.getPeerRole() == EPeerRole.JOINER) {
                assertEquals(this.joinerPeerTest.getUserId(), peer.getUserId());
                assertEquals(this.joinerPeerTest.getUserToken(), peer.getUserToken());
                assertEquals(this.joinerPeerTest.getPeerRole(), peer.getPeerRole());
                assertEquals(this.joinerPeerTest.getClientConnectionStatus(), peer.getClientConnectionStatus());
            }
        });

        verify(this.mockLogger).info(
                eq("Peer added to session, userToken={}, sessionToken={}"),
                eq(this.joinerPeerTest.getUserToken()),
                any(String.class));
    }

    @Test
    @DisplayName("Should not add peer to existing session when peer is duplicated - addPeerToExistingSession")
    public void addPeerToExistingSessionFailPeerDuplicated() {
        PeerSession peerSession = this.sessionManager.addPeerToExistingSession(this.sessionTokenTest, this.newPeerTest);
        assertEquals(1, peerSession.getPeerClients().size());
        assertEquals(this.sessionTokenTest, peerSession.getSessionToken());
        assertNotNull(peerSession.getSecretKey());
        assertEquals(peerSession.getSessionStatus(), ESessionStatus.CREATED);
        verify(this.mockLogger).error(eq(String.format("PeerClient is duplicated when adding to session, sessionToken=%s", this.sessionTokenTest)));
    }

    @Test
    @DisplayName("Should update session - updateSession")
    public void updateSessionPass() {
        this.joinerPeerTest.setClientConnectionStatus(EClientConnectionStatus.DISCONNECTED_FAIL);
        this.peerSessionTest.addPeerClient(this.joinerPeerTest);
        ArgumentCaptor<PeerSession> argumentCaptor = ArgumentCaptor.forClass(PeerSession.class);
        ArgumentCaptor<String> argumentCaptorStr = ArgumentCaptor.forClass(String.class);
        this.sessionManager.updateSession(this.peerSessionTest);
        verify(this.sessionRepository).saveSession(argumentCaptorStr.capture(), argumentCaptor.capture());
        PeerSession capturedSession = argumentCaptor.getValue();
        String capturedSessionToken = argumentCaptorStr.getValue();

        PeerClient foundPeerClient = capturedSession.getPeerClients()
                .stream()
                .filter(peerClient -> peerClient.getUserId().equals(this.joinerPeerTest.getUserId()))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Peer not found"));
        assertEquals(EClientConnectionStatus.DISCONNECTED_FAIL, foundPeerClient.getClientConnectionStatus());
        assertEquals(this.peerSessionTest.getSessionToken(), capturedSessionToken);
    }

    @Test
    @DisplayName("Should throw illegal exception when peerSession is null - updateSession")
    public void updateSessionFailSessionNull() {

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            this.sessionManager.updateSession(null);
        });
        assertEquals("PeerSession cannot be null when updating session", exception.getMessage());
    }

    @Test
    @DisplayName("Should remove user from session - removeClientFromSession")
    public void removeClientFromSessionPass() {
        this.peerSessionTest.addPeerClient(this.joinerPeerTest);
        when(this.sessionRepository.getSession(any(String.class))).thenReturn(this.peerSessionTest);
        PeerSession newPeerSession = TestFactory.createPeerSession();
        this.sessionManager.removeClientFromSession(newPeerSession);
        ArgumentCaptor<PeerSession> argumentCaptor = ArgumentCaptor.forClass(PeerSession.class);
        ArgumentCaptor<String> argumentCaptorStr = ArgumentCaptor.forClass(String.class);
        verify(this.sessionRepository).saveSession(argumentCaptorStr.capture(), argumentCaptor.capture());
        PeerSession capturedSession = argumentCaptor.getValue();
        String capturedToken = argumentCaptorStr.getValue();
        assertEquals(1, capturedSession.getPeerClients().size());
        assertEquals(ESessionStatus.INTERRUPTED, capturedSession.getSessionStatus());
        assertEquals(this.sessionTokenTest, capturedToken);
    }

    @Test
    @DisplayName("Should throw exception when user is not exist in session - removeClientFromSession")
    public void removeClientFromSessionFailPeerNotInSession() {
        when(this.sessionRepository.getSession(any(String.class))).thenReturn(this.peerSessionTest);
        PeerSession newPeerSession = TestFactory.createPeerSession();
        newPeerSession.addPeerClient(this.joinerPeerTest);
        NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> {
                this.sessionManager.removeClientFromSession(newPeerSession);
        });
        assertEquals("Peer to remove doesn't exist", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw exception when user is not exist in update session - removeClientFromSession")
    public void removeClientFromSessionFailPeerNotInUpdateSession() {
        when(this.sessionRepository.getSession(any(String.class))).thenReturn(this.peerSessionTest);
        PeerSession emptyPeerSession = TestFactory.createEmptyPeerSession();
        NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> {
            this.sessionManager.removeClientFromSession(emptyPeerSession);
        });
        assertEquals("Peers to remove list is empty", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw exception when peerSession is null - removeClientFromSession")
    public void removeClientFromSessionFailPeerSessionNull() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            this.sessionManager.removeClientFromSession(null);
        });
        assertEquals("PeerSession in remove session is null", exception.getMessage());
    }

}
