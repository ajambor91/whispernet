package net.whisper.session.Clients.Kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.session.Clients.Models.Client;
import net.whisper.session.Clients.Models.ClientWithoutSession;
import net.whisper.session.Core.Enums.EKafkaTopic;
import net.whisper.session.Utils.TestFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@SpringBootTest(properties = {
        "spring.Kafka.bootstrap-servers=localhost:9095",
        "spring.Kafka.consumer.auto-offset-reset=earliest",
        "spring.Kafka.listener.missing-topics-fatal=false"
})
public class ClientsKafkaProducerTest {

    private final ClientsKafkaProducer clientsKafkaProducer;
    private Client client;
    private ClientWithoutSession clientWithoutSession;
    private String serializedClient;

    @MockBean
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    public ClientsKafkaProducerTest(ClientsKafkaProducer clientsKafkaProducer) {
        this.clientsKafkaProducer = clientsKafkaProducer;
    }

    @BeforeEach
    public void setup() {
        this.client = TestFactory.createClient();
        this.clientWithoutSession = TestFactory.createClientWihtoutSession();
        this.serializedClient = "{\"userToken\":\"bb6e4276-7f6c-40fe-a413-e98d912c3510\",\"userId\":\"22469c67-ba59-4bbd-b47a-7d5a4394928a\",\"clientConnectionStatus\":\"CREATED\",\"peerRole\":\"JOINER\",\"sessionType\":null,\"username\":null,\"sessionToken\":\"9489dc7f-e441-4a19-86d6-1e7ddb2ea48c\",\"secretKey\":null,\"partners\":null}";

    }

    @Test
    @DisplayName("Should return new user - returnNewUser")
    public void returnNewUserPass() {
        this.clientsKafkaProducer.returnNewUser(this.client);
        verify(this.kafkaTemplate).send(argThat(((Message<String> message) -> {
            assertEquals(EKafkaTopic.RETURN_CLIENT_TOPIC.getTopicName(), message.getHeaders().get(KafkaHeaders.TOPIC));
            assertEquals(this.serializedClient, message.getPayload());
            return true;
        })));
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException - returnNewUser")
    public void returnNewUserException() {
        IllegalArgumentException e = assertThrows(IllegalArgumentException.class, () -> {
            this.clientsKafkaProducer.returnNewUser(null);
        });
        assertEquals("Client cannot be null", e.getMessage());
    }

    @Test
    @DisplayName("Should throw JsonProcessingException - returnNewUser")
    public void returnNewUserJSONException() throws JsonProcessingException {
        ObjectMapper objectMapper = mock(ObjectMapper.class);
        when(objectMapper.writeValueAsString(any(Client.class))).thenThrow(JsonProcessingException.class);
        Logger logger = mock(Logger.class);
        ReflectionTestUtils.setField(this.clientsKafkaProducer, "objectMapper", objectMapper);
        ReflectionTestUtils.setField(this.clientsKafkaProducer, "logger", logger);
        this.clientsKafkaProducer.returnNewUser(this.client);
        verify(logger).error(
                eq("Json process message error userToken={}, message={}"),
                eq(this.client.getUserToken()),
                any(String.class)
        );
    }
}
