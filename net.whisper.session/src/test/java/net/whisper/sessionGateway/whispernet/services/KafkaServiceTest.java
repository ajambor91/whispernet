package net.whisper.sessionGateway.whispernet.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.sessionGateway.enums.EKafkaMessageTypes;
import net.whisper.sessionGateway.enums.EKafkaTopic;
import net.whisper.sessionGateway.models.Client;
import net.whisper.sessionGateway.models.ClientWithoutSession;
import net.whisper.sessionGateway.services.KafkaService;
import net.whisper.sessionGateway.whispernet.utils.TestFactory;
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

import static net.whisper.sessionGateway.whispernet.utils.TestFactory.TEST_USER_TOKEN;
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
    private String testResponseMessage;
    private ObjectMapper objectMapper;
    private final KafkaService kafkaService;
    private Client client;
    private Client joinerClient;
    private ClientWithoutSession clientWithoutSession;

    private String serializedJoinMessage;
    private String serializedMessage;
    private ConcurrentHashMap<String, BlockingQueue<Client>> responseMap;
    private BlockingQueue<Client> realQueue;

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
        Client fromQueue = realQueue.poll(10, TimeUnit.SECONDS);
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
        Client fromQueue = this.realQueue.poll(10, TimeUnit.SECONDS);
        assertNotNull(fromQueue);
        assertNotEquals("INVALID TOKEN", fromQueue);

    }

    @Test
    @DisplayName("Should wait for message pass")
    public void shouldWaitForMessagePass() throws InterruptedException {
        this.realQueue.put(this.client);
        Client client = this.kafkaService.waitForMessage(this.client, this.waitForMessageTimeout);
        assertEquals(client.getUserToken(), TEST_USER_TOKEN);


    }

    @Test
    @DisplayName("Should wait for message fail with mismatch clients")
    public void shouldWaitForMessageFail() {
        assertThrows(RuntimeException.class, () -> {
            this.realQueue.put(this.client);
            Client client = this.kafkaService.waitForMessage(this.joinerClient, this.waitForMessageTimeout);
            assertNotEquals(client.getUserToken(), TEST_USER_TOKEN);
        });

    }

    @Test
    @DisplayName("Should wait for message fail with null client")
    public void shouldWaitForMessageWithInvalidFail() {
        assertThrows(RuntimeException.class, () -> {
            this.realQueue.put(this.client);
            Client client = this.kafkaService.waitForMessage(null, this.waitForMessageTimeout);
            assertNotEquals(client.getUserToken(), TEST_USER_TOKEN);
        });
    }

    @Test
    @DisplayName("Should send client pass")
    public void shouldPassSendClient() throws JsonProcessingException {

        this.kafkaService.sendNewClient(this.clientWithoutSession);

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
        this.kafkaService.sendJoinlient(this.joinerClient);
        verify(this.kafkaTemplate).send(argThat(((Message<String> message) -> {
            assertEquals(this.serializedJoinMessage, message.getPayload());
            assertEquals(EKafkaTopic.CLIENT_TOPIC.getTopicName(), message.getHeaders().get(KafkaHeaders.TOPIC));
            assertEquals(EKafkaMessageTypes.ADD_CLIENT.getMessageType(), message.getHeaders().get("type"));
            return true;
        })));

    }
}