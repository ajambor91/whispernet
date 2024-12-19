package net.whisper.sessionGateway.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.sessionGateway.enums.EKafkaMessageTypes;
import net.whisper.sessionGateway.enums.EKafkaTopic;
import net.whisper.sessionGateway.factories.ClientFactory;
import net.whisper.sessionGateway.factories.KafkaTemplatesFactory;
import net.whisper.sessionGateway.interfaces.IBaseClient;
import net.whisper.sessionGateway.models.Client;
import net.whisper.sessionGateway.models.ClientWithoutSession;
import net.whisper.sessionGateway.templates.KafkaClientMessage;
import net.whisper.sessionGateway.templates.KafkaClientWithoutSessionMessage;
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
import org.springframework.stereotype.Service;

import java.util.concurrent.*;

@Service
public class KafkaService {
    private final Logger logger;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final ConcurrentHashMap<String, BlockingQueue<Client>> responseMap;

    @Autowired
    public KafkaService(
            ObjectMapper objectMapper,
            KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.responseMap = new ConcurrentHashMap<>();
        this.logger = LoggerFactory.getLogger(KafkaService.class);
    }

    @KafkaListener(topics = "request-return-client-topic", groupId = "whispernet-session-clients-group")
    public void listen(String message) {
        if (message.isEmpty()) {
            throw new NullPointerException("Message is empty");
        }
        logger.info("Received kafka message from wssession service to create a new session message={}", message);
        Client client = null;
        try {
            client = this.getClient(message);

        } catch (JsonProcessingException e) {
            logger.error(String.valueOf(e));
            return;
        }
        BlockingQueue<Client> queue = responseMap.get(client.getUserToken());
        if (queue != null) {
            try {
                queue.put(client);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                logger.error(String.valueOf(e));
            }
        }
    }

    public Client waitForMessage(IBaseClient client, long timeoutInSeconds) throws InterruptedException {
        BlockingQueue<Client> queue = responseMap.computeIfAbsent(client.getUserToken(), k -> new LinkedBlockingQueue<>());
        try {
            Client message = queue.poll(timeoutInSeconds, TimeUnit.SECONDS);
            if (message == null) {
                throw new RuntimeException("Timeout: No message received from Kafka for token: " + client.getUserToken());
            }
            return message;
        } finally {
            responseMap.remove(client.getUserToken());
            logger.info("Remove client from hashmap, userToken={}", client.getUserToken());
        }

    }

    public void sendNewClient(ClientWithoutSession client) throws JsonProcessingException {
        KafkaClientWithoutSessionMessage clientWithoutSessionMessage = KafkaTemplatesFactory.createNewClientTemplate(client);
        String kafkaMessageString = this.objectMapper.writeValueAsString(clientWithoutSessionMessage);
        logger.info("Sending new client session using Kafka to wssession");
        sendKafkaMsg(
                kafkaMessageString,
                EKafkaTopic.CLIENT_TOPIC.getTopicName(),
                EKafkaMessageTypes.NEW_CLIENT.getMessageType()
        );
        logger.info("New client message was send");

    }

    public void sendJoinlient(Client client) throws JsonProcessingException {
        KafkaClientMessage clientTemplate = KafkaTemplatesFactory.creatJoinClientTemplate(client);
        String kafkaMessageString = this.objectMapper.writeValueAsString(clientTemplate);
        logger.info("Sending joining client session using Kafka to wssession");
        sendKafkaMsg(kafkaMessageString, EKafkaTopic.CLIENT_TOPIC.getTopicName(), EKafkaMessageTypes.ADD_CLIENT.getMessageType());
        logger.info("Joining client message was send");


    }

    private Client getClient(String message) throws JsonProcessingException {
        KafkaClientMessage client = objectMapper.readValue(message, KafkaClientMessage.class);
        return ClientFactory.createClientFromTemplate(client);
    }

    private void sendKafkaMsg(String parsedObject, String topic, String type) {
        Message<String> message = MessageBuilder
                .withPayload(parsedObject)
                .setHeader(KafkaHeaders.TOPIC, topic)
                .setHeader("type", type)
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
