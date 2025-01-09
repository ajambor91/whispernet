package net.whisper.wssession.session.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.wssession.core.enums.EKafkaMessageTypes;
import net.whisper.wssession.core.enums.EKafkaTopic;
import net.whisper.wssession.session.models.PeerSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Component
public class SessionKafkaProducer {

    private final Logger logger;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public SessionKafkaProducer(ObjectMapper objectMapper, KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.logger = LoggerFactory.getLogger(SessionKafkaProducer.class);
    }
    public void sendSession(PeerSession peerSession, EKafkaMessageTypes type)  {
        if (peerSession == null) {
            logger.error("SessionKafkaProducer:sendSession - PeerSession cannot be null");
            return;
        }
        try {
            String message = this.objectMapper.writeValueAsString(peerSession);
            this.sendKafkaMsg(message, EKafkaTopic.WEBSOCKET_SESSION_TOPIC.getTopicName(), type);
            logger.info("SessionKafkaProducer:sendSession - Kafka message with session to webscoket was send, sessionToken={}", peerSession.getSessionToken());
        } catch (JsonProcessingException e) {
            logger.error("SessionKafkaProducer:sendSession - JSON process session message failed, sessionToken={}, message={}", peerSession.getSessionToken(), e.getMessage());
        }

    }

    private void sendKafkaMsg(String parsedObject, String topic, EKafkaMessageTypes type) {
        Message<String> message = MessageBuilder
                .withPayload(parsedObject)
                .setHeader(KafkaHeaders.TOPIC, topic)
                .setHeader("type", type.getMessageType())
                .build();
        kafkaTemplate.send(message);

    }
}
