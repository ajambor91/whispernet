package net.whisper.session.Core.Coordinators;



import net.whisper.session.Clients.Enums.EClientConnectionStatus;
import net.whisper.session.Clients.Models.Client;
import net.whisper.session.Clients.Services.ClientsService;
import net.whisper.session.Core.Coordinatos.ClientSessionCoordinator;
import net.whisper.session.Session.Models.PeerClient;
import net.whisper.session.Session.Models.PeerSession;
import net.whisper.session.Session.Services.SessionService;
import net.whisper.session.Utils.TestFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import static net.whisper.session.Utils.TestFactory.SESSION_TOKEN_JOINER;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest
public class ClientSessionCoordinatorTest {

    private final ClientSessionCoordinator clientSessionCoordinator;
    private final PeerClient newClient;
    private final PeerSession peerSession;
    private final PeerClient joinClient;
    private final String sessionToken;
    private Logger logger;
    @SpyBean
    private SessionService sessionService;
    @SpyBean
    private ClientsService clientsService;
    @MockBean
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    public ClientSessionCoordinatorTest(ClientSessionCoordinator clientSessionCoordinator) {
        this.clientSessionCoordinator = clientSessionCoordinator;
        this.peerSession = TestFactory.createPeerSession();
        this.joinClient = TestFactory.createPeerClientJoiner();
        this.newClient = TestFactory.createPeerClientInitiator();
        this.sessionToken = SESSION_TOKEN_JOINER;
    }

    @BeforeEach
    public void setup() {
        this.logger = mock(Logger.class);
        ReflectionTestUtils.setField(this.clientSessionCoordinator, "logger", logger);
    }

    @Test
    @DisplayName("Should call process new client - processClientWithoutSession")
    public void processClientWithoutSession() {
        this.clientSessionCoordinator.processClientWithoutSession(this.newClient);
        verify(this.sessionService).processNewClient(eq(this.newClient));
    }

    @Test
    @DisplayName("Should log error and break method when peer is null - processClientWithoutSession")
    public void processClientWithoutSessionFailPeerNull() {
        this.clientSessionCoordinator.processClientWithoutSession(null);
        verify(this.logger).error(eq("ClientSessionCoordinator:processClientWithoutSession newClient cannot be null"));
        verify(this.sessionService, never()).processNewClient(any(PeerClient.class));
    }

    @Test
    @DisplayName("Should process joining client - processClient")
    public void processClient() {
        this.clientSessionCoordinator.processClient(this.sessionToken, this.joinClient);
        verify(this.sessionService).processJoinClient(any(String.class), any(PeerClient.class));
    }

    @Test
    @DisplayName("Should log error when sessionToken is null - processClient")
    public void processClientFailSessionTokenNull() {
        this.clientSessionCoordinator.processClient(null, this.joinClient);
        verify(this.logger).error(eq("ClientSessionCoordinator:processClient sessionToken cannot be null"));
        verify(this.sessionService, never()).processJoinClient(any(String.class), any(PeerClient.class));
    }

    @Test
    @DisplayName("Should log error when peer is null - processClient")
    public void processClientFailPeerNull() {
        this.clientSessionCoordinator.processClient(this.sessionToken, null);
        verify(this.logger).error(eq("ClientSessionCoordinator:processClient client cannot be null"));
        verify(this.sessionService, never()).processJoinClient(any(String.class), any(PeerClient.class));
    }

    @Test
    @DisplayName("Should return data to user")
    public void returnDataToUser() {
        this.clientSessionCoordinator.returnDataToUser(this.peerSession, this.newClient);
        ArgumentCaptor<Client> argumentCaptor = ArgumentCaptor.forClass(Client.class);
        verify(this.clientsService).returnDataToUser(argumentCaptor.capture());
        assertInstanceOf(Client.class, argumentCaptor.getValue());
        Client client = argumentCaptor.getValue();
        assertEquals(this.peerSession.getSessionToken(), client.getSessionToken());
        assertEquals(this.newClient.getUserToken(), client.getUserToken());
        assertEquals(this.newClient.getUserId(), client.getUserId());
        assertEquals(EClientConnectionStatus.CREATED, client.getClientConnectionStatus());
    }

    @Test
    @DisplayName("Should log error when peerSession is null - returnDataToUser")
    public void returnDataToUserFailPeerSessionNull() {
        this.clientSessionCoordinator.returnDataToUser(null, this.newClient);
        verify(this.logger).error(eq("ClientSessionCoordinator:returnDataToUser peerSession cannot be null"));
        verify(this.clientsService, never()).returnDataToUser(any(Client.class));

    }

    @Test
    @DisplayName("Should log error when peerClient is null - returnDataToUser")
    public void returnDataToUserFailPeerClientNull() {
        this.clientSessionCoordinator.returnDataToUser(this.peerSession, null);
        verify(this.logger).error(eq("ClientSessionCoordinator:returnDataToUser peerClient cannot be null"));
        verify(this.clientsService, never()).returnDataToUser(any(Client.class));

    }

}
