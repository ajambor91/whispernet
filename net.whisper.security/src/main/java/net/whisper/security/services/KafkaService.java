package net.whisper.security.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.security.interfaces.ISignedClient;
import net.whisper.security.models.SignedClient;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.kafka.support.SendResult;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class KafkaService {
    private final Logger logger;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final ConcurrentHashMap<String, BlockingQueue<ISignedClient>> responseMap;
    private final LoginService loginService;

    @Autowired
    public KafkaService(
            ObjectMapper objectMapper,
            KafkaTemplate<String, String> kafkaTemplate,
            LoginService loginService
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.responseMap = new ConcurrentHashMap<>();
        this.loginService = loginService;
        this.logger = LoggerFactory.getLogger(KafkaService.class);
    }

    @KafkaListener(topics = "request-signed-client-topic", groupId = "whispernet-session-signed-security-group")
    public void listen(String message) throws JsonProcessingException {
        if (message.isEmpty()) {
            throw new NullPointerException("Message is empty");
        }

        logger.info("Received kafka message from wssession service to create a new session message={}", message);
        ISignedClient client = null;
        String clientString = null;
        try {
            client =  objectMapper.readValue(message, SignedClient.class);
            this.loginService.checkLogin(client);

        } catch (JsonProcessingException e) {
            logger.error(String.valueOf(e));
            clientString = this.objectMapper.writeValueAsString(client);
            this.sendKafkaMsg(clientString);
        }
    }

    public void returnVerifiedClient(ISignedClient client){
        try {
            String message = this.objectMapper.writeValueAsString(client);
            this.sendKafkaMsg(message);

        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

    }

    private void sendKafkaMsg(String parsedObject) {
        Message<String> message = MessageBuilder
                .withPayload(parsedObject)
                .setHeader(KafkaHeaders.TOPIC, "request-check-return-signed-client-topic")
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