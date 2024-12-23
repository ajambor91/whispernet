package net.whisper.wssession.clients.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.wssession.clients.models.Client;
import net.whisper.wssession.core.enums.EKafkaTopic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Component
public class ClientsKafkaProducer {
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final Logger logger;
    @Autowired
    public ClientsKafkaProducer(ObjectMapper objectMapper, KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.logger = LoggerFactory.getLogger(ClientsKafkaProducer.class);
    }

    public void returnNewUser(Client userClient) {
        try {
            String message = this.objectMapper.writeValueAsString(userClient);
            this.sendKafkaMsg(message, EKafkaTopic.RETURN_CLIENT_TOPIC.getTopicName());
            logger.info("Send kafka client message, userToken={}", userClient.getUserToken());
        } catch (JsonProcessingException e) {
            logger.error("Json process message error userToken={}, message={}", userClient.getUserToken(), e.getMessage());
        }


    }

    private void sendKafkaMsg(String parsedObject, String topic) {
        Message<String> message = MessageBuilder
                .withPayload(parsedObject)
                .setHeader(KafkaHeaders.TOPIC, topic)
                .setHeader("type", "Token")
                .build();
        kafkaTemplate.send(message);

    }
}
