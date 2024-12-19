package net.whisper.sessionGateway.whispernet.services;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.sessionGateway.managers.ClientManager;
import net.whisper.sessionGateway.models.BaseClient;
import net.whisper.sessionGateway.models.Client;
import net.whisper.sessionGateway.models.ClientWithoutSession;
import net.whisper.sessionGateway.services.KafkaService;
import net.whisper.sessionGateway.services.SessionService;
import net.whisper.sessionGateway.whispernet.utils.TestFactory;
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

import java.util.concurrent.CompletableFuture;

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
    private Client client;
    private Client joiner;
    private ObjectMapper objectMapper;

    @Autowired
    public SessionServiceTest(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @BeforeEach
    public void setup() {
        this.clientWithoutSession = TestFactory.createClientWithoutSession();
        this.client = TestFactory.createClient();
        this.joiner = TestFactory.createJoinerClient();
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
        Client client = this.sessionService.createClient();
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
            Client client = this.sessionService.createClient();

        });
    }

    @Test
    @DisplayName("Should create joiner client")
    public void shouldCreateJoinerClient() throws InterruptedException, JsonProcessingException {
        doReturn(this.joiner).when(this.kafkaService).waitForMessage(any(BaseClient.class), anyLong());
        CompletableFuture<SendResult<String, String>> mockFuture = CompletableFuture.completedFuture(mock(SendResult.class));
        when(this.kafkaTemplate.send(any(Message.class))).thenReturn(mockFuture);
        Client client = this.sessionService.createNextClientSession(this.objectMapper.writeValueAsString(this.joiner));
        assertEquals(this.joiner, client);
    }

    @Test
    @DisplayName("Should throw exception when mismatch clients for joinClient")
    public void shouldThrowExceptionCreateClientWhenJoinClientMissmatchTest() {
        CompletableFuture<SendResult<String, String>> mockFuture = CompletableFuture.completedFuture(mock(SendResult.class));
        when(this.kafkaTemplate.send(any(Message.class))).thenReturn(mockFuture);
        assertThrows(RuntimeException.class, () -> {
            this.kafkaService.waitForMessage(this.joiner, 1);
            Client client = this.sessionService.createNextClientSession(this.client.getSessionToken());

        });
    }
}
