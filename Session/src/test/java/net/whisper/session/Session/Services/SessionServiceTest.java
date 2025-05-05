package net.whisper.session.Session.Services;


import net.whisper.session.Clients.Enums.EPeerRole;
import net.whisper.session.Core.Coordinatos.ClientSessionCoordinator;
import net.whisper.session.Session.Managers.SessionManager;
import net.whisper.session.Session.Models.PeerClient;
import net.whisper.session.Session.Models.PeerSession;
import net.whisper.session.Session.Repositories.SessionRepository;
import net.whisper.session.Utils.TestFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.kafka.core.KafkaTemplate;

import static net.whisper.session.Utils.TestFactory.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest(properties = {
        "spring.kafka.bootstrap-servers=localhost:9095",
        "spring.kafka.consumer.auto-offset-reset=earliest",
        "spring.kafka.listener.missing-topics-fatal=false"
})
public class SessionServiceTest {
    private final SessionService sessionService;
    private PeerClient peerClientInitiator;
    private PeerClient peerClientJoiner;
    private PeerSession peerSession;
    private PeerSession emptySession;
    private String testSessionToken;

    @MockBean
    private KafkaTemplate<String, String> kafkaTemplate;

    @MockBean
    private SessionRepository sessionRepository;

    @SpyBean
    private SessionManager sessionManager;

    @SpyBean
    private ClientSessionCoordinator clientSessionCoordinator;

    @Autowired
    public SessionServiceTest(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @BeforeEach
    public void setup() {
        this.peerSession = TestFactory.createPeerSession();
        this.emptySession = TestFactory.createEmptyPeerSession();
        this.peerClientInitiator = TestFactory.createPeerClientInitiator();
        this.peerClientJoiner = TestFactory.createPeerClientJoiner();
        this.testSessionToken = SESSION_TOKEN_JOINER;
        when(this.sessionRepository.getSession(any(String.class))).thenReturn(this.peerSession);
    }

    @Test
    @DisplayName("Should process new client - processNewClient")
    public void processNewClientPass() {
        this.sessionService.processNewClient(this.peerClientInitiator);
        verify(this.sessionManager).createSession(eq(this.peerClientInitiator));
        ArgumentCaptor<PeerSession> argumentCaptor = ArgumentCaptor.forClass(PeerSession.class);
        verify(this.clientSessionCoordinator).returnDataToUser(argumentCaptor.capture(), eq(this.peerClientInitiator));
        PeerSession capturedSession = argumentCaptor.getValue();
        assertEquals(capturedSession.getPeerClients().size(), 1);
        assertNotNull(capturedSession.getSessionToken());
        assertNotNull(capturedSession.getSecretKey());
        capturedSession.getPeerClients().forEach(peer -> {
            assertEquals(peer.getUserId(), this.peerClientInitiator.getUserId());
            assertEquals(peer.getUserToken(), this.peerClientInitiator.getUserToken());
            assertEquals(peer.getPeerRole(), this.peerClientInitiator.getPeerRole());
            assertEquals(peer.getClientConnectionStatus(), this.peerClientInitiator.getClientConnectionStatus());
        });
    }

    @Test
    @DisplayName("Should throw illegal argument error when client is null - processNewClient")
    public void processNewClientFailWhenClientNull() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            this.sessionService.processNewClient(null);
        });
        assertEquals("PeerClient for new client processing cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Should process joining client - processJoinClient")
    public void processJoiningClientPass() {
        this.sessionService.processJoinClient(this.testSessionToken, this.peerClientJoiner);
        ArgumentCaptor<PeerSession> argumentCaptor = ArgumentCaptor.forClass(PeerSession.class);
        verify(this.clientSessionCoordinator).returnDataToUser(argumentCaptor.capture(), eq(this.peerClientJoiner));
        PeerSession capturedSession = argumentCaptor.getValue();
        assertEquals(capturedSession.getPeerClients().size(), 2);
        assertNotNull(capturedSession.getSessionToken());
        assertNotNull(capturedSession.getSecretKey());
        capturedSession.getPeerClients().forEach(peer -> {
            assertNotNull(peer.getPeerRole());
            if (peer.getPeerRole() == EPeerRole.INITIATOR) {
                assertEquals(USER_ID_INITIATOR, peer.getUserId());
                assertEquals(USER_TOKEN_INITIATOR, peer.getUserToken());
            } else if (peer.getPeerRole() == EPeerRole.JOINER) {
                assertEquals(USER_TOKEN_JOINER, peer.getUserToken());
                assertEquals(USER_ID_JOINER, peer.getUserId());
            }
        });

    }

    @Test
    @DisplayName("Should throw illegal argument error when client is null - processJoinClient")
    public void processJoiningClientFailWhenClientNull() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            this.sessionService.processJoinClient(this.testSessionToken, null);
        });
        assertEquals("PeerClient for joining client processing cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw illegal argument error when sessionToken is null - processJoinClient")
    public void processJoiningClientFailWhenSessionTokenNull() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            this.sessionService.processJoinClient(null, this.peerClientJoiner);
        });
        assertEquals("sessionToken for joining client processing cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Should update Session - updateSession")
    public void updateSessionPass() {
        this.sessionService.updateSession(this.peerSession);
        verify(this.sessionManager).updateSession(eq(this.peerSession));
    }

    @Test
    @DisplayName("Should throw illegal argument exception when peerSession is null - updateSession")
    public void updateSessionFailWhenPeerSessionNull() {
        IllegalArgumentException illegalArgumentException = assertThrows(IllegalArgumentException.class, () -> {
            this.sessionService.updateSession(null);
        });
        assertEquals("PeerSession cannot be null when updating Session", illegalArgumentException.getMessage());
    }

    @Test
    @DisplayName("Should remove peer from Session - removeClientFromSession")
    public void removeClientFromSessionPass() {
        this.peerSession.addPeerClient(TestFactory.createPeerClientJoiner());
        when(this.sessionRepository.getSession(any(String.class))).thenReturn(this.peerSession);

        this.sessionService.removeClientFromSession(this.peerSession);
        verify(this.sessionManager).removeClientFromSession(any(PeerSession.class));
    }

    @Test
    @DisplayName("Should throw illegal argument exception when peerSession is null - ")
    public void removeClientFromSessionFailWhenPeerSessionNull() {
        IllegalArgumentException illegalArgumentException = assertThrows(IllegalArgumentException.class, () -> {
            this.sessionService.removeClientFromSession(null);
        });
        assertEquals("PeerSession cannot be null when removing peer", illegalArgumentException.getMessage());
    }
}
