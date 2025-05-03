package net.whisper.usersession.Services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.usersession.Enums.EKafkaMessageTypes;
import net.whisper.usersession.Enums.EKafkaTopic;
import net.whisper.usersession.Models.Client;
import net.whisper.usersession.Models.ClientWithoutSession;
import net.whisper.usersession.Models.IncomingClient;
import net.whisper.usersession.Utils.TestFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.kafka.support.SendResult;
import org.springframework.messaging.Message;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.concurrent.*;

import static net.whisper.usersession.Utils.TestFactory.TEST_USER_TOKEN;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest(properties = {
        "spring.kafka.bootstrap-servers=localhost:9095",
        "spring.kafka.consumer.auto-offset-reset=earliest",
        "spring.kafka.listener.missing-topics-fatal=false"
})
public class KafkaServiceTest {
    private final long waitForMessageTimeout = 10;
    private final KafkaService kafkaService;
    private String testResponseMessage;
    private ObjectMapper objectMapper;
    private Client client;
    private Client joinerClient;
    private ClientWithoutSession clientWithoutSession;
    private IncomingClient incomingClient;
    private IncomingClient incomingJoiner;
    private String serializedJoinMessage;
    private String serializedMessage;
    private ConcurrentHashMap<String, BlockingQueue<IncomingClient>> responseMap;
    private BlockingQueue<IncomingClient> realQueue;

    @MockBean
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    public KafkaServiceTest(KafkaService kafkaService) {
        this.kafkaService = kafkaService;
    }

    @BeforeEach
    public void setup() throws NoSuchFieldException, JsonProcessingException {

        this.objectMapper = new ObjectMapper();
        this.client = TestFactory.createClient();
        this.incomingClient = TestFactory.createIncomingClient();
        this.incomingJoiner = TestFactory.createIncomingJoinerClient();
        this.joinerClient = TestFactory.createJoinerClient();
        this.clientWithoutSession = TestFactory.createClientWithoutSession();
        this.testResponseMessage = String.format("{\"userToken\":\"%s\",\"userId\":\"d4418d30-3ce2-405a-b7fd-994181518c04\",\"clientConnectionStatus\":\"CREATED\",\"peerRole\":\"INITIATOR\",\"sessionToken\":\"748f56cf-ebab-4fb7-92a7-45f363a2daac\"}", TEST_USER_TOKEN);
        this.responseMap = new ConcurrentHashMap<>();
        this.realQueue = new LinkedBlockingQueue<>();
        this.serializedMessage = this.objectMapper.writeValueAsString(this.clientWithoutSession);
        this.serializedJoinMessage = this.objectMapper.writeValueAsString(this.joinerClient);
        CompletableFuture<SendResult<String, String>> mockFuture = CompletableFuture.completedFuture(mock(SendResult.class));
        when(this.kafkaTemplate.send(any(Message.class))).thenReturn(mockFuture);

        KafkaService.class.getDeclaredField("responseMap");

        this.responseMap.put(TEST_USER_TOKEN, realQueue);
        ReflectionTestUtils.setField(kafkaService, "responseMap", this.responseMap);


    }

    @Test
    @DisplayName("Should pass listen method")
    public void listenTest() throws InterruptedException {
        this.kafkaService.listen(this.testResponseMessage);
        IncomingClient fromQueue = realQueue.poll(10, TimeUnit.SECONDS);
        assertNotNull(fromQueue);
        assertEquals(TEST_USER_TOKEN, fromQueue.getUserToken());


    }

    @Test
    @DisplayName("Should fail listen method with null argument")
    public void listenFailTest() {

        assertThrows(NullPointerException.class, () -> {
            this.kafkaService.listen(null);
        });
    }

    @Test
    @DisplayName("Should fail listen method with invalid client token")
    public void listenFailWithInvalidClientMessage() throws InterruptedException {
        this.kafkaService.listen(this.testResponseMessage);
        IncomingClient fromQueue = this.realQueue.poll(10, TimeUnit.SECONDS);
        assertNotNull(fromQueue);
        assertNotEquals("INVALID TOKEN", fromQueue);

    }

    @Test
    @DisplayName("Should wait for message pass")
    public void shouldWaitForMessagePass() throws InterruptedException {
        this.realQueue.put(this.incomingClient);
        IncomingClient client = this.kafkaService.waitForMessage(this.client, this.waitForMessageTimeout);
        assertEquals(client.getUserToken(), TEST_USER_TOKEN);


    }

    @Test
    @DisplayName("Should wait for message fail with mismatch clients")
    public void shouldWaitForMessageFail() {
        assertThrows(RuntimeException.class, () -> {
            this.realQueue.put(this.incomingClient);
            IncomingClient client = this.kafkaService.waitForMessage(this.joinerClient, this.waitForMessageTimeout);
            assertNotEquals(client.getUserToken(), TEST_USER_TOKEN);
        });

    }

    @Test
    @DisplayName("Should wait for message fail with null client")
    public void shouldWaitForMessageWithInvalidFail() {
        assertThrows(RuntimeException.class, () -> {
            this.realQueue.put(this.incomingClient);
            IncomingClient client = this.kafkaService.waitForMessage(null, this.waitForMessageTimeout);
            assertNotEquals(client.getUserToken(), TEST_USER_TOKEN);
        });
    }

    @Test
    @DisplayName("Should send client pass")
    public void shouldPassSendMessage() throws JsonProcessingException {

        this.kafkaService.sendMessage(this.clientWithoutSession, EKafkaMessageTypes.NEW_CLIENT);

        verify(this.kafkaTemplate).send(argThat((Message<String> message) -> {
            assertEquals(this.serializedMessage, message.getPayload());
            assertEquals(EKafkaTopic.CLIENT_TOPIC.getTopicName(), message.getHeaders().get(KafkaHeaders.TOPIC));
            assertEquals(EKafkaMessageTypes.NEW_CLIENT.getMessageType(), message.getHeaders().get("type"));
            return true;
        }));

    }

    @Test
    @DisplayName("Should send joining client pass")
    public void shouldSendJoiningClientPass() throws JsonProcessingException {
        this.kafkaService.sendMessage(this.joinerClient, EKafkaMessageTypes.ADD_CLIENT);
        verify(this.kafkaTemplate).send(argThat(((Message<String> message) -> {
            assertEquals(this.serializedJoinMessage, message.getPayload());
            assertEquals(EKafkaTopic.CLIENT_TOPIC.getTopicName(), message.getHeaders().get(KafkaHeaders.TOPIC));
            assertEquals(EKafkaMessageTypes.ADD_CLIENT.getMessageType(), message.getHeaders().get("type"));
            return true;
        })));

    }
}
