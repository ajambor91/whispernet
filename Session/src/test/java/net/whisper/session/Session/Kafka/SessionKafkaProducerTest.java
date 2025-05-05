package net.whisper.session.Session.Kafka;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.session.Core.Enums.EKafkaMessageTypes;
import net.whisper.session.Session.Models.PeerSession;
import net.whisper.session.Utils.TestFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.Message;
import org.springframework.test.util.ReflectionTestUtils;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest(properties = {
        "spring.kafka.bootstrap-servers=localhost:9095",
        "spring.kafka.consumer.auto-offset-reset=earliest",
        "spring.kafka.listener.missing-topics-fatal=false"
})
public class SessionKafkaProducerTest {
    private final SessionKafkaProducer sessionKafkaProducer;
    private PeerSession peerSession;

    private final Logger logger;

    @MockBean
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    public SessionKafkaProducerTest(SessionKafkaProducer sessionKafkaProducer) {
        this.sessionKafkaProducer = sessionKafkaProducer;
        this.logger = mock(Logger.class);
        ReflectionTestUtils.setField(this.sessionKafkaProducer, "logger", this.logger);
    }

    @BeforeEach
    public void setup() {
        this.peerSession = TestFactory.createPeerSession();
    }

    @Test
    @DisplayName("Should sendSession - sendSession")
    public void sendSessionPass() {
        ObjectMapper mapper = new ObjectMapper();
        ReflectionTestUtils.setField(this.sessionKafkaProducer, "objectMapper", mapper);
        this.sessionKafkaProducer.sendSession(this.peerSession, EKafkaMessageTypes.NEW_SESSION);
        verify(this.kafkaTemplate).send(any(Message.class));
        verify(this.logger).info(
                eq("SessionKafkaProducer:sendSession - Kafka message with Session to webscoket was send, sessionToken={}, topic={}"),
                eq(this.peerSession.getSessionToken()),
                eq("request-websocket-session-topic")
        );
    }

    @Test
    @DisplayName("Should log error when peerSession is null - sendSession")
    public void sendSessionFail() {
        this.sessionKafkaProducer.sendSession(null, EKafkaMessageTypes.NEW_SESSION);
        verify(this.logger).error(
                eq("SessionKafkaProducer:sendSession - PeerSession cannot be null")
        );
    }

    @Test
    @DisplayName("Should log error when cannot deserialize json - sendSession")
    public void sendSessionFailInvalidPeerSession() throws JsonProcessingException {
        PeerSession session = mock(PeerSession.class);
        ObjectMapper mapper = mock(ObjectMapper.class);
        ReflectionTestUtils.setField(this.sessionKafkaProducer, "objectMapper", mapper);
        when(mapper.writeValueAsString(any(PeerSession.class))).thenThrow(JsonProcessingException.class);
        this.sessionKafkaProducer.sendSession(session, EKafkaMessageTypes.NEW_SESSION);
        verify(this.logger).error(
                eq("SessionKafkaProducer:sendSession - JSON process Session message failed, sessionToken={}, message={}"),
                any(),
                any()
        );
    }

}
