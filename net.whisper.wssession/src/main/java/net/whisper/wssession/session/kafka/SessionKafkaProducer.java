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

@Component
public class SessionKafkaProducer {
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;


    public void sendSession(PeerSession peerSession, EKafkaMessageTypes type) throws JsonProcessingException {
        String message = this.objectMapper.writeValueAsString(peerSession);
        this.sendKafkaMsg(message, EKafkaTopic.WEBSOCKET_SESSION_TOPIC.getTopicName(), type);
    }

    private void setupMessage(PeerSession peerSession) {

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
