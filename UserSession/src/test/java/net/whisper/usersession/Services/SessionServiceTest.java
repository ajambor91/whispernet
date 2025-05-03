package net.whisper.usersession.Services;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.usersession.DTO.Requests.PeerState;
import net.whisper.usersession.Enums.EPGPSessionType;
import net.whisper.usersession.Exceptions.ApprovalExisiting;
import net.whisper.usersession.Exceptions.UserUnauthorizationException;
import net.whisper.usersession.Interfaces.IChecker;
import net.whisper.usersession.Managers.ClientManager;
import net.whisper.usersession.Models.*;
import net.whisper.usersession.Utils.TestFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.messaging.Message;

import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.CompletableFuture;

import static net.whisper.usersession.Utils.TestFactory.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest(properties = {
        "spring.kafka.bootstrap-servers=localhost:9095",
        "spring.kafka.consumer.auto-offset-reset=earliest",
        "spring.kafka.listener.missing-topics-fatal=false"
})
public class SessionServiceTest {
    private final SessionService sessionService;
    @MockBean
    private KafkaTemplate<String, String> kafkaTemplate;
    @SpyBean
    private ClientManager clientManager;
    @SpyBean
    private KafkaService kafkaService;
    private ClientWithoutSession clientWithoutSession;
    private IncomingClient client;
    private IncomingClient joiner;
    private Map<String, String> mockJoinHeaders;
    private PeerState peerStateJoiner;
    private PeerState peerState;
    private IChecker checker;
    @SpyBean
    private AuthService authService;
    private ObjectMapper objectMapper;
    private Map<String, String> mockHeaders;
    private SignedClient signedClient;
    private SignedClient signedClientJoin;

    @Autowired
    public SessionServiceTest(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @BeforeEach
    public void setup() {
        this.checker = TestFactory.createUpdateChecker();
        this.signedClientJoin = TestFactory.createJoinSignedClient();
        this.clientWithoutSession = TestFactory.createClientWithoutSession();
        this.peerState = TestFactory.createPeerState();
        this.client = TestFactory.createIncomingClient();
        this.signedClient = TestFactory.createJoinSignedInitiator();
        this.joiner = TestFactory.createIncomingJoinerClient();
        this.peerStateJoiner = TestFactory.createJoinPeerState();
        this.mockHeaders = TestFactory.createTestInitiatorHeaders();
        this.mockJoinHeaders = TestFactory.createTestJoinHeaders();
        this.objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("Should create client")
    public void shouldCreateClientTest() throws JsonProcessingException, InterruptedException {
        doAnswer(inv -> {
            ClientWithoutSession res = (ClientWithoutSession) inv.callRealMethod();
            return this.clientWithoutSession;
        }).when(this.clientManager).setupNewClient();
        doReturn(this.client).when(this.kafkaService).waitForMessage(any(BaseClient.class), anyLong());
        CompletableFuture<SendResult<String, String>> mockFuture = CompletableFuture.completedFuture(mock(SendResult.class));
        when(this.kafkaTemplate.send(any(Message.class))).thenReturn(mockFuture);
        IncomingClient client = this.sessionService.createClient();
        assertEquals(client.getUserToken(), this.clientWithoutSession.getUserToken());
    }

    @Test
    @DisplayName("Should throw exception when mismatch clients for createClient")
    public void shouldThrowExceptionCreateClientWhenClientMissmatchTest() throws JsonProcessingException, InterruptedException {
        doAnswer(inv -> {
            ClientWithoutSession res = (ClientWithoutSession) inv.callRealMethod();
            return this.clientWithoutSession;
        }).when(this.clientManager).setupNewClient();

        CompletableFuture<SendResult<String, String>> mockFuture = CompletableFuture.completedFuture(mock(SendResult.class));
        when(this.kafkaTemplate.send(any(Message.class))).thenReturn(mockFuture);
        assertThrows(RuntimeException.class, () -> {
            this.kafkaService.waitForMessage(this.joiner, 5);
            IncomingClient client = this.sessionService.createClient();

        });
    }

    @Test
    @DisplayName("Should create joiner client for verified session")
    public void shouldCreateJoinerClient() throws InterruptedException, JsonProcessingException {
        this.joiner.setSessionType(EPGPSessionType.CHECK_RESPONDER);
        this.signedClientJoin.setSessionType(EPGPSessionType.CHECK_RESPONDER);
        this.returnKafkaSignedAndIncomingClientJoin();
        IncomingClient client = this.sessionService.createNextClientSession(TEST_SESSION_TOKEN_JOINER, this.mockHeaders);
        assertEquals(this.joiner, client);
    }

    @Test
    @DisplayName("Should create joiner client for verified session when client is verified")
    public void shouldCreateJoinerClientWhenClientIsVeirified() throws InterruptedException, JsonProcessingException {
        this.joiner.setSessionType(EPGPSessionType.CHECK_RESPONDER);
        this.signedClientJoin.setSessionType(EPGPSessionType.VERIFIED);
        this.returnKafkaSignedAndIncomingClientJoin();
        IncomingClient client = this.sessionService.createNextClientSession(TEST_SESSION_TOKEN_JOINER, this.mockHeaders);
        assertEquals(this.joiner, client);
    }

    @Test
    @DisplayName("Should create joiner client for unverified session")
    public void shouldCreateJoinerClientForVerifiedSession() throws InterruptedException, JsonProcessingException {
        doReturn(this.joiner).when(this.kafkaService).waitForMessage(any(BaseClient.class), anyLong());
        CompletableFuture<SendResult<String, String>> mockFuture = CompletableFuture.completedFuture(mock(SendResult.class));
        when(this.kafkaTemplate.send(any(Message.class))).thenReturn(mockFuture);
        IncomingClient client = this.sessionService.createNextClientSession(TEST_SESSION_TOKEN_JOINER, this.mockHeaders);
        assertEquals(this.joiner, client);
    }

    @Test
    @DisplayName("Should throws SecurityException joiner client for verified session when headers are empty")
    public void shouldThrowsSecurityException() throws InterruptedException, JsonProcessingException {
        UserUnauthorizationException securityException = assertThrows(UserUnauthorizationException.class, () -> {
            this.joiner.setSessionType(EPGPSessionType.CHECK_RESPONDER);
            this.returnKafkaSignedAndIncomingClientJoin();
            IncomingClient client = this.sessionService.createNextClientSession(TEST_SESSION_TOKEN_JOINER, Map.of());
        });
        assertEquals("Username not found", securityException.getMessage());
    }

    @Test
    @DisplayName("Should throw exception when mismatch clients for joinClient")
    public void shouldThrowExceptionCreateClientWhenJoinClientMissmatchTest() {
        CompletableFuture<SendResult<String, String>> mockFuture = CompletableFuture.completedFuture(mock(SendResult.class));
        when(this.kafkaTemplate.send(any(Message.class))).thenReturn(mockFuture);
        assertThrows(RuntimeException.class, () -> {
            this.kafkaService.waitForMessage(this.joiner, 1);
            IncomingClient client = this.sessionService.createNextClientSession(this.client.getSessionToken(), this.mockHeaders);

        });
    }

    @Test
    @DisplayName("Should update client")
    public void shouldUpdateClientPass() throws InterruptedException, JsonProcessingException, ApprovalExisiting {
        this.signedClientJoin.setSessionType(EPGPSessionType.VERIFIED);
        this.returnKafkaSignedAndIncomingClientJoin();
        IncomingClient client = this.sessionService.updateClient(TEST_USER_TOKEN_JOINER, TEST_SESSION_TOKEN_JOINER, this.mockJoinHeaders, this.peerStateJoiner);
        assertEquals(client.getUserToken(), this.joiner.getUserToken());
    }

    @Test
    @DisplayName("Should throw NoSuchElementException when incomingClient is null")
    public void shouldUpdateClientFailWhenIncomingClientIsNull() throws InterruptedException, JsonProcessingException, ApprovalExisiting {
        NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> {
            this.signedClientJoin.setSessionType(EPGPSessionType.VERIFIED);
            this.returnKafkaSignedAndIncomingClientJoin();
            doReturn(null).when(this.kafkaService).waitForMessage(any(BaseClient.class), anyLong());

            IncomingClient client = this.sessionService.updateClient(TEST_USER_TOKEN_JOINER, TEST_SESSION_TOKEN_JOINER, this.mockJoinHeaders, this.peerStateJoiner);
        });
        assertEquals("Cannot find client to update in passed session", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw ApprovalExisiting when confirming exists is null")
    public void shouldUpdateClientFailApprovingExisting() throws InterruptedException, JsonProcessingException, ApprovalExisiting {
        this.peerStateJoiner.setSessionAuthType(EPGPSessionType.WAITING_FOR_PEER_ACCEPTED.getSessionPGPStatus());
        ApprovalExisiting exception = assertThrows(ApprovalExisiting.class, () -> {
            IncomingClient client = this.sessionService.updateClient(TEST_USER_TOKEN_JOINER, TEST_SESSION_TOKEN_JOINER, this.mockJoinHeaders, this.peerStateJoiner);
        });
        assertEquals("Approving session exists", exception.getMessage());
    }

    @Test
    @DisplayName("Should create signed client")
    public void createSignClientPass() throws InterruptedException, JsonProcessingException {
        doAnswer(inv -> {
            ClientWithoutSession res = (ClientWithoutSession) inv.callRealMethod();
            return this.clientWithoutSession;
        }).when(this.clientManager).setupNewClient();
        this.returnKafkaSignedAndIncomingClient();
        IncomingClient client = this.sessionService.createSignClient(this.mockHeaders);
        assertEquals(client.getUserToken(), this.clientWithoutSession.getUserToken());
    }

    @Test
    @DisplayName("Should throws SecurityException when signed client is null")
    public void createSignClientFail() throws InterruptedException, JsonProcessingException {

        SecurityException securityException = assertThrows(SecurityException.class, () -> {
            doAnswer(inv -> {
                ClientWithoutSession res = (ClientWithoutSession) inv.callRealMethod();
                return this.clientWithoutSession;
            }).when(this.clientManager).setupNewClient();
            this.signedClient.setSessionType(EPGPSessionType.UNSIGNED);
            this.returnKafkaSignedAndIncomingClient();
            IncomingClient client = this.sessionService.createSignClient(this.mockHeaders);
        });

        assertEquals("Client unauthorized", securityException.getMessage());
    }

    @Test
    @DisplayName("Should update initiator status")
    public void shouldUpdateInitiatorStatus() throws InterruptedException, ApprovalExisiting, JsonProcessingException {
        this.returnKafkaSignedAndIncomingClient();
        IncomingClient client = this.sessionService.updateStatusAndGetPartners(TEST_USER_TOKEN, TEST_SESSION_TOKEN, this.mockHeaders, this.peerState);
        assertEquals(TEST_USER_TOKEN, client.getUserToken());
    }

    @Test
    @DisplayName("Should throws exception when session is WAITING_FOR_PEER_ACCEPTED")
    public void shouldUpdateInitiatorStatusThrowsApprovingException() throws InterruptedException, ApprovalExisiting, JsonProcessingException {
        ApprovalExisiting approvalExisiting = assertThrows(ApprovalExisiting.class, () -> {
            this.returnKafkaSignedAndIncomingClient();
            this.peerState.setSessionAuthType(EPGPSessionType.WAITING_FOR_PEER_ACCEPTED.getSessionPGPStatus());
            IncomingClient client = this.sessionService.updateStatusAndGetPartners(TEST_USER_TOKEN, TEST_SESSION_TOKEN, this.mockHeaders, this.peerState);
        });
        assertEquals("Approving session exists", approvalExisiting.getMessage());
    }

    @Test
    @DisplayName("Should throw NoSuchElementException when incomingClient is null in update initiator status")
    public void updateStatusAndGetPartnersFailWhenIncomingClientIsNull() throws InterruptedException, JsonProcessingException, ApprovalExisiting {
        NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> {
            this.signedClientJoin.setSessionType(EPGPSessionType.VERIFIED);
            this.returnKafkaSignedAndIncomingClient();
            doReturn(null).when(this.kafkaService).waitForMessage(any(BaseClient.class), anyLong());

            IncomingClient client = this.sessionService.updateStatusAndGetPartners(TEST_USER_TOKEN, TEST_SESSION_TOKEN, this.mockHeaders, this.peerState);
        });
        assertEquals("Cannot found client to update", exception.getMessage());
    }

    private void returnKafkaSignedAndIncomingClientJoin() throws InterruptedException {
        doReturn(this.signedClientJoin).when(this.authService).waitForConfirmed(any(SignedCheckingClient.class), anyLong());
        doReturn(this.joiner).when(this.kafkaService).waitForMessage(any(BaseClient.class), anyLong());
        doReturn(this.checker).when(this.authService).waitForPartnersConfirmed(any(Checker.class), anyLong());
        CompletableFuture<SendResult<String, String>> mockFuture = CompletableFuture.completedFuture(mock(SendResult.class));
        when(this.kafkaTemplate.send(any(Message.class))).thenReturn(mockFuture);
    }

    private void returnKafkaSignedAndIncomingClient() throws InterruptedException {
        doReturn(this.client).when(this.kafkaService).waitForMessage(any(BaseClient.class), anyLong());
        doReturn(this.signedClient).when(this.authService).waitForConfirmed(any(SignedCheckingClient.class), anyLong());
        doReturn(this.checker).when(this.authService).waitForPartnersConfirmed(any(Checker.class), anyLong());

        CompletableFuture<SendResult<String, String>> mockFuture = CompletableFuture.completedFuture(mock(SendResult.class));
        when(this.kafkaTemplate.send(any(Message.class))).thenReturn(mockFuture);
    }

}
