package net.whisper.wssession.clients.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.wssession.clients.enums.EKafkaMessageClientTypes;
import net.whisper.wssession.clients.models.Client;
import net.whisper.wssession.clients.models.ClientWithoutSession;
import net.whisper.wssession.clients.services.ClientsService;
import net.whisper.wssession.core.interfaces.IBaseClient;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ClientsConsumerService {
    private final ObjectMapper objectMapper;
    private final Logger logger;
    private final ClientsService clientsService;

    @Autowired
    ClientsConsumerService(ClientsService clientsService, ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.clientsService = clientsService;
        this.logger = LoggerFactory.getLogger(ClientsConsumerService.class);

    }

    @KafkaListener(topics = {"request-client-topic"}, groupId = "whispernet-wsession-clients-group")
    public void handleTokenEvent(ConsumerRecord<String, String> record) {
        try {
            String message = record.value();
            String type = this.getHeaderValue(record, "type");
            if (type == null) {
                logger.error("Type is null");
                return;
            }
            if (message == null) {
                logger.error("Message is null");
                return;
            }
            IBaseClient kafkaMessage = mapMessage(type, message);
            System.out.println(message);
            if (kafkaMessage instanceof ClientWithoutSession) {
                logger.info("Received kafka message for new client, userToken={}", ((ClientWithoutSession) kafkaMessage).getUserToken());
                clientsService.processNewClient((ClientWithoutSession) kafkaMessage);
            } else if (kafkaMessage instanceof Client) {
                clientsService.processJoiningClient((Client) kafkaMessage);
                logger.info("Received kafka message for joining client, userToken={}, sessionToken={}", ((Client) kafkaMessage).getUserToken(), ((Client) kafkaMessage).getSessionToken());
            }
            logger.error("Error: Received an empty kafka message");
        } catch (Exception e) {
            logger.error("Error processing message={}", e.getMessage());
        }
    }

    private String getHeaderValue(ConsumerRecord<String, String> record, String headerKey) {
        if (record.headers() != null) {
            return record.headers().lastHeader(headerKey) != null
                    ? new String(record.headers().lastHeader(headerKey).value())
                    : null;
        }
        return null;
    }

    private IBaseClient mapMessage(String type, String message) throws JsonProcessingException {
        if (EKafkaMessageClientTypes.NEW_CLIENT.getMessageType().equals(type)) {

            return objectMapper.readValue(message, ClientWithoutSession.class);
        } else if (EKafkaMessageClientTypes.ADD_CLIENT.getMessageType().equals(type)) {
            return objectMapper.readValue(message, Client.class);
        } else {
            throw new RuntimeException("Unknown message type: " + type);
        }
    }
}
