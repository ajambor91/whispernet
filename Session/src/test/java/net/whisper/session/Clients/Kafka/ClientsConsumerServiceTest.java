package net.whisper.session.Clients.Kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.session.Clients.Enums.EKafkaMessageClientTypes;
import net.whisper.session.Clients.Models.Client;
import net.whisper.session.Clients.Models.ClientWithoutSession;
import net.whisper.session.Clients.Services.ClientsService;
import net.whisper.session.Core.Interfaces.IBaseClient;
import net.whisper.session.Utils.TestFactory;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.header.internals.RecordHeaders;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest(properties = {
        "spring.Kafka.bootstrap-servers=localhost:9095",
        "spring.Kafka.consumer.auto-offset-reset=earliest",
        "spring.Kafka.listener.missing-topics-fatal=false"
})
public class ClientsConsumerServiceTest {

    private final ClientsConsumerService clientsConsumerService;
    private final ObjectMapper objectMapper;
    @SpyBean
    private ClientsService clientsService;
    private ClientWithoutSession clientWithoutSession;
    private Client client;

    @Autowired
    public ClientsConsumerServiceTest(ClientsConsumerService clientsConsumerService, ObjectMapper objectMapper) {
        this.clientsConsumerService = clientsConsumerService;
        this.objectMapper = objectMapper;
    }

    @BeforeEach
    public void setup() {
        this.clientWithoutSession = TestFactory.createClientWihtoutSession();
        this.client = TestFactory.createClient();
    }

    @Test
    @DisplayName("Should handle token from Kafka for new client- handleTokenEvent")
    public void handleTokenEventNewClient() throws JsonProcessingException {
        String newClient = this.objectMapper.writeValueAsString(this.clientWithoutSession);
        ConsumerRecord<String, String> consumerRecord = this.createRecordHeaders(newClient, EKafkaMessageClientTypes.NEW_CLIENT.getMessageType());
        this.clientsConsumerService.handleTokenEvent(consumerRecord);
        verify(this.clientsService).processNewClient(any(ClientWithoutSession.class));
    }

    @Test
    @DisplayName("Should handle token from Kafka for adding client - handleTokenEvent")
    public void handleTokenEventAddClient() throws JsonProcessingException {
        String joiningClient = this.objectMapper.writeValueAsString(this.client);
        ConsumerRecord<String, String> consumerRecord = this.createRecordHeaders(joiningClient, EKafkaMessageClientTypes.ADD_CLIENT.getMessageType());
        this.clientsConsumerService.handleTokenEvent(consumerRecord);
        verify(this.clientsService).processJoiningClient(any(Client.class));
    }

    @Test
    @DisplayName("Should log error for Kafka for invalid message- handleTokenEvent")
    public void handleTokenEventInvalidMessageNewClient() {
        String newClient = "INVALID_MESSAGE";
        Logger logger = mock(Logger.class);
        ReflectionTestUtils.setField(this.clientsConsumerService, "logger", logger);
        ConsumerRecord<String, String> consumerRecord = this.createRecordHeaders(newClient, EKafkaMessageClientTypes.NEW_CLIENT.getMessageType());
        this.clientsConsumerService.handleTokenEvent(consumerRecord);
        verify(logger).error(
                eq("Error processing message={}"),
                any(String.class)
        );
    }

    @Test
    @DisplayName("Should log error for mismatch headers- handleTokenEvent")
    public void handleTokenEventWhenMismatchMessageType() throws JsonProcessingException {
        String newClient = this.objectMapper.writeValueAsString(this.client);
        Logger logger = mock(Logger.class);
        ReflectionTestUtils.setField(this.clientsConsumerService, "logger", logger);
        ConsumerRecord<String, String> consumerRecord = this.createRecordHeaders(newClient, EKafkaMessageClientTypes.ADD_CLIENT.getMessageType());
        this.clientsConsumerService.handleTokenEvent(consumerRecord);
        verify(logger).error(
                eq("Error: Received an empty Kafka message")
        );
    }

    @Test
    @DisplayName("Should log error when headers is empty- handleTokenEvent")
    public void handleTokenEventWhenHeaderIsEmpty() throws JsonProcessingException {
        String newClient = this.objectMapper.writeValueAsString(this.client);
        Logger logger = mock(Logger.class);
        ReflectionTestUtils.setField(this.clientsConsumerService, "logger", logger);
        ConsumerRecord<String, String> consumerRecord = this.createRecordHeaders(newClient, null);
        this.clientsConsumerService.handleTokenEvent(consumerRecord);
        verify(logger).error(
                eq("Type is null")
        );
    }

    @Test
    @DisplayName("Should log error when message is empty - handleTokenEvent")
    public void handleTokenEventWhenMessageIsEmpty() throws JsonProcessingException {
        Logger logger = mock(Logger.class);
        ReflectionTestUtils.setField(this.clientsConsumerService, "logger", logger);
        ConsumerRecord<String, String> consumerRecord = this.createRecordHeaders(null, EKafkaMessageClientTypes.ADD_CLIENT.getMessageType());
        this.clientsConsumerService.handleTokenEvent(consumerRecord);
        verify(logger).error(
                eq("Message is null")
        );
    }

    @Test
    @DisplayName("Should map message to ClientWithoutSession when type is NEW_CLIENT")
    public void mapMessageToClientWithoutSession() throws JsonProcessingException {
        String message = objectMapper.writeValueAsString(clientWithoutSession);
        String type = EKafkaMessageClientTypes.NEW_CLIENT.getMessageType();

        IBaseClient result = ReflectionTestUtils.invokeMethod(clientsConsumerService, "mapMessage", type, message);

        assertNotNull(result);
        assertInstanceOf(ClientWithoutSession.class, result);
        assertEquals(clientWithoutSession.getUserToken(), result.getUserToken());
    }

    @Test
    @DisplayName("Should map message to Client when type is ADD_CLIENT")
    public void mapMessageToClient() throws JsonProcessingException {
        String message = objectMapper.writeValueAsString(client);
        String type = EKafkaMessageClientTypes.ADD_CLIENT.getMessageType();
        IBaseClient result = ReflectionTestUtils.invokeMethod(clientsConsumerService, "mapMessage", type, message);
        assertNotNull(result);
        assertInstanceOf(Client.class, result);
        assertEquals(client.getUserToken(), result.getUserToken());
    }

    @Test
    @DisplayName("Should throw exception for unknown message type")
    public void mapMessageUnknownType() {
        String message = "{}";
        String type = "UNKNOWN_TYPE";

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                ReflectionTestUtils.invokeMethod(clientsConsumerService, "mapMessage", type, message)
        );
        assertEquals("Unknown message type: UNKNOWN_TYPE", exception.getMessage());
    }

    private ConsumerRecord<String, String> createRecordHeaders(String message, String type) {
        ConsumerRecord<String, String> consumerRecord = mock(ConsumerRecord.class);
        if (type != null) {
            RecordHeaders recordHeaders = new RecordHeaders();
            recordHeaders.add("type", type.getBytes());
            when(consumerRecord.headers()).thenReturn(recordHeaders);
        }
        when(consumerRecord.value()).thenReturn(message);
        return consumerRecord;
    }
}
