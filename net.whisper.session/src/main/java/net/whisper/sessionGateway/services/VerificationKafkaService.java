package net.whisper.sessionGateway.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.sessionGateway.enums.EKafkaTopic;
import net.whisper.sessionGateway.interfaces.IVerification;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.kafka.support.SendResult;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
public class VerificationKafkaService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final Logger logger;
    private final ObjectMapper objectMapper;

    @Autowired
    public VerificationKafkaService(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.logger = LoggerFactory.getLogger(KafkaService.class);
    }


    public void sendVerificationRequest(IVerification verification) throws JsonProcessingException {
        String verificationMessageString = this.objectMapper.writeValueAsString(verification);
        this.sendKafkaMsg(verificationMessageString, EKafkaTopic.VERIFICATION_REQUEST.getTopicName());
    }

    private void sendKafkaMsg(String parsedObject, String topic) {
        Message<String> message = MessageBuilder
                .withPayload(parsedObject)
                .setHeader(KafkaHeaders.TOPIC, topic)
                .build();
        CompletableFuture<SendResult<String, String>> future = this.kafkaTemplate.send(message);
        future.thenAccept(result -> {
            RecordMetadata recordMetadata = result.getRecordMetadata();
            logger.info("Kafka message was send topic={}, partition={}, offset={}", recordMetadata.topic(), recordMetadata.partition(), recordMetadata.offset());
        }).exceptionally(ex -> {
            logger.error("Kafka message send error={}", ex.getMessage());
            return null;
        });
    }
}
