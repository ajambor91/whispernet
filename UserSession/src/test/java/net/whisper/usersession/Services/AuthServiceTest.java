package net.whisper.usersession.Services;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.usersession.Interfaces.IChecker;
import net.whisper.usersession.Interfaces.ISignedClient;
import net.whisper.usersession.Models.IncomingClient;
import net.whisper.usersession.Utils.TestFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.messaging.Message;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.concurrent.*;

import static net.whisper.usersession.Utils.TestFactory.TEST_USER_ID_JOINER;
import static net.whisper.usersession.Utils.TestFactory.TEST_USER_TOKEN;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
public class AuthServiceTest {
    private final ObjectMapper objectMapper;
    private final AuthService authService;
    @Mock
    private Logger logger;
    private IChecker checker;
    private ISignedClient signedClient;
    @MockBean
    private KafkaTemplate<String, String> kafkaTemplate;
    private BlockingQueue<ISignedClient> signedClientsQueue;
    private ConcurrentHashMap<String, BlockingQueue<ISignedClient>> signedClientBlockingMap;
    private IncomingClient client;
    private BlockingQueue<IChecker> partnersQueue;
    private ConcurrentHashMap<String, BlockingQueue<IChecker>> partnersMap;

    @Autowired
    public AuthServiceTest(AuthService authService, ObjectMapper objectMapper) {
        this.authService = authService;
        this.objectMapper = objectMapper;
    }

    @BeforeEach
    public void setup() {
        this.client = TestFactory.createIncomingClient();
        this.signedClient = TestFactory.createJoinSignedInitiator();
        this.checker = TestFactory.createUpdateChecker();
        this.signedClientsQueue = new LinkedBlockingQueue<>();
        this.signedClientBlockingMap = new ConcurrentHashMap<>();
        this.partnersQueue = new LinkedBlockingQueue<>();
        this.partnersMap = new ConcurrentHashMap<>();
        this.signedClientBlockingMap.put(TEST_USER_TOKEN, this.signedClientsQueue);
        this.partnersMap.put(TEST_USER_ID_JOINER, this.partnersQueue);
        CompletableFuture<SendResult<String, String>> mockFuture = CompletableFuture.completedFuture(mock(SendResult.class));
        when(this.kafkaTemplate.send(any(Message.class))).thenReturn(mockFuture);
        ReflectionTestUtils.setField(this.authService, "verificationMap", this.signedClientBlockingMap);
        ReflectionTestUtils.setField(this.authService, "partnersMap", this.partnersMap);
        ReflectionTestUtils.setField(this.authService, "logger", logger);
    }

    @Test
    @DisplayName("Should pass listen on request-check-return-signed-client-topic")
    public void shouldPassListenRequestCheckReturnSignedClientTopic() throws JsonProcessingException, InterruptedException {
        this.authService.listen(this.objectMapper.writeValueAsString(this.signedClient));
        ISignedClient fromQueue = this.signedClientsQueue.poll(100, TimeUnit.MILLISECONDS);
        assertNotNull(fromQueue);
        assertEquals(TEST_USER_TOKEN, fromQueue.getUserToken());
    }

    @Test
    @DisplayName("Should pass listen on request-signed-partner-topic")
    public void shouldPassListenRequestSignedPartnerTopic() throws JsonProcessingException, InterruptedException {
        this.authService.listenForPartnersChecked(this.objectMapper.writeValueAsString(this.checker));
        IChecker fromQueue = this.partnersQueue.poll(100, TimeUnit.MILLISECONDS);
        assertNotNull(fromQueue);
        assertEquals(TEST_USER_ID_JOINER, fromQueue.getUserId());
    }

    @Test
    @DisplayName("Should throw JSON Exception request-check-return-signed-client-topic")
    public void shouldThrowsJSONExceptionListenRequestCheckReturnSignedClientTopic() throws JsonProcessingException, InterruptedException {
        this.authService.listen("INVALID JSON");
        verify(logger).info(any(String.class), any(String.class));
        verify(logger).debug(any(String.class));
        verify(logger).error(any(String.class));

    }

    @Test
    @DisplayName("Should throw JSON Exceptio request-signed-partner-topic")
    public void shouldThrowsJSONExceptionListenRequestSignedPartnerTopic() throws JsonProcessingException, InterruptedException {
        this.authService.listenForPartnersChecked("INVALID CLASS");
        verify(logger).info(any(String.class), any(String.class));
        verify(logger).debug(any(String.class));
        verify(logger).error(any(String.class));

    }

    @Test
    @DisplayName("Should return checker object")
    public void shouldReturnCheckerObject() throws InterruptedException {
        this.partnersQueue.put(this.checker);
        IChecker checker = this.authService.waitForPartnersConfirmed(this.checker, 10);
        assertEquals(this.checker.getUserId(), checker.getUserId());
    }

    @Test
    @DisplayName("Should return signedClient object")
    public void shouldReturnSignedClientObject() throws InterruptedException {
        this.signedClientsQueue.put(this.signedClient);
        ISignedClient signedClient = this.authService.waitForConfirmed(this.signedClient, 10);
        assertEquals(this.client.getUserId(), signedClient.getUserId());
    }

    @Test
    @DisplayName("Should throws runtime exception when message is null waitForConfirmed")
    public void shouldThrowsRuntimeExceptionWaitForConfirmed() throws InterruptedException {
        assertThrows(RuntimeException.class, () -> {
            this.signedClientsQueue.put(null);
            ISignedClient signedClient = this.authService.waitForConfirmed(this.signedClient, 10);
            assertEquals(this.client.getUserId(), signedClient.getUserId());
        });
    }

    @Test
    @DisplayName("Should throws runtime exception when message is null waitForPartnersConfirmed")
    public void shouldThrowsRuntimeExceptionWaitForPartnersConfirmed() throws InterruptedException {
        assertThrows(RuntimeException.class, () -> {
            this.partnersQueue.put(null);
            IChecker checker = this.authService.waitForPartnersConfirmed(this.checker, 10);
            assertEquals(this.client.getUserId(), checker.getUserId());
        });
    }


}
