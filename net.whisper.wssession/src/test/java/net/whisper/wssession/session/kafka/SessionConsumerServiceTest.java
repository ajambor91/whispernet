package net.whisper.wssession.session.kafka;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.wssession.clients.enums.EClientConnectionStatus;
import net.whisper.wssession.session.enums.EKafkaMessageSessionTypes;
import net.whisper.wssession.session.models.PeerClient;
import net.whisper.wssession.session.models.PeerSession;
import net.whisper.wssession.session.services.SessionService;
import net.whisper.wssession.utils.TestFactory;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.header.internals.RecordHeaders;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.util.ReflectionTestUtils;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.mockito.Mockito.*;

@SpringBootTest
public class SessionConsumerServiceTest {


    @SpyBean
    private SessionService sessionService;
    private final SessionConsumerService sessionConsumerService;
    private final ObjectMapper objectMapper;
    private PeerSession peerSession;
    private PeerClient joinPeer;
    @Autowired
    public SessionConsumerServiceTest(SessionConsumerService sessionConsumerService, ObjectMapper objectMapper) {
        this.sessionConsumerService = sessionConsumerService;
        this.objectMapper = objectMapper;
    }

    @BeforeEach
    public void setup() {
        this.peerSession = TestFactory.createPeerSession();
        this.joinPeer = TestFactory.createPeerClientJoiner();
    }

    @Test
    @DisplayName("Should update session - handleTokenEvent")
    public void handleTokenEventUpdateSessionPass() throws JsonProcessingException {
        this.joinPeer.setClientConnectionStatus(EClientConnectionStatus.DISCONNECTED);
        this.peerSession.addPeerClient(this.joinPeer);
        String message = this.objectMapper.writeValueAsString(this.peerSession);
        ConsumerRecord<String, String> record = this.createRecord(message, EKafkaMessageSessionTypes.DISCONNECT_USER.getMessageType());
        ArgumentCaptor<PeerSession> argumentCaptor = ArgumentCaptor.forClass(PeerSession.class);
        this.sessionConsumerService.handleTokenEvent(record);
        verify(this.sessionService).updateSession(argumentCaptor.capture());

        assertInstanceOf(PeerSession.class, argumentCaptor.getValue());
        assertEquals(this.peerSession.getSessionToken(), argumentCaptor.getValue().getSessionToken());
    }

    @Test
    @DisplayName("Should remove user from session - handleTokenEvent")
    public void handleTokenEventRemoveSessionPass() throws JsonProcessingException {
        this.joinPeer.setClientConnectionStatus(EClientConnectionStatus.DISCONNECTED);
        this.peerSession.addPeerClient(this.joinPeer);
        String message = this.objectMapper.writeValueAsString(this.peerSession);
        ConsumerRecord<String, String> record = this.createRecord(message, EKafkaMessageSessionTypes.REMOVE_USER.getMessageType());
        ArgumentCaptor<PeerSession> argumentCaptor = ArgumentCaptor.forClass(PeerSession.class);
        this.sessionConsumerService.handleTokenEvent(record);
        verify(this.sessionService).removeClientFromSession(argumentCaptor.capture());

        assertInstanceOf(PeerSession.class, argumentCaptor.getValue());
        assertEquals(this.peerSession.getSessionToken(), argumentCaptor.getValue().getSessionToken());
    }

    @Test
    @DisplayName("Should not process any message when type is null - handleTokenEvent")
    public void handleTokenEventFailTypeNull() throws JsonProcessingException {
        Logger logger = mock(Logger.class);
        ReflectionTestUtils.setField(this.sessionConsumerService, "logger", logger);
        this.joinPeer.setClientConnectionStatus(EClientConnectionStatus.DISCONNECTED);
        this.peerSession.addPeerClient(this.joinPeer);
        String message = this.objectMapper.writeValueAsString(this.peerSession);
        ConsumerRecord<String, String> record = this.createRecord(message, null);
        this.sessionConsumerService.handleTokenEvent(record);
        verify(logger).warn(eq("Message header not known - SessionService:handleTokenEvent"));
    }

    @Test
    @DisplayName("Should not process any message when type is null - handleTokenEvent")
    public void handleTokenEventFailMessageNull() {
        Logger logger = mock(Logger.class);
        ReflectionTestUtils.setField(this.sessionConsumerService, "logger", logger);
        this.joinPeer.setClientConnectionStatus(EClientConnectionStatus.DISCONNECTED);
        this.peerSession.addPeerClient(this.joinPeer);
        ConsumerRecord<String, String> record = this.createRecord(null, EKafkaMessageSessionTypes.DISCONNECT_USER.getMessageType());
        this.sessionConsumerService.handleTokenEvent(record);
        verify(logger).error(eq("Processing message error - SessionService:handleTokenEvent"));
    }

    private ConsumerRecord<String, String> createRecord(String message, String type) {
        ConsumerRecord<String, String> consumerRecord = mock(ConsumerRecord.class);
        if (type != null) {
            RecordHeaders recordHeaders = new RecordHeaders();
            recordHeaders.add("type", type.getBytes());
            when(consumerRecord.headers()).thenReturn(recordHeaders);
        }
        when(consumerRecord.value()).thenReturn(message);
        return  consumerRecord;
    }
}