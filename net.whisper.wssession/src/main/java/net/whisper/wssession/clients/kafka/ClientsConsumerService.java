package net.whisper.wssession.clients.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.wssession.clients.enums.EKafkaMessageClientTypes;
import net.whisper.wssession.clients.services.ClientsService;
import net.whisper.wssession.clients.templates.KafkaClientMessage;
import net.whisper.wssession.clients.templates.KafkaClientWithoutSessionMessage;
import net.whisper.wssession.core.interfaces.IKafkaMessage;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class ClientsConsumerService {
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ClientsService clientsService;

    @KafkaListener(topics = {"request-client-topic"}, groupId = "whispernet-wsession-clients-group")
    public void handleTokenEvent(ConsumerRecord<String, String> record) {
        try {
            String message = record.value();
            String type = this.getHeaderValue(record, "type");

            if (type == null || message == null) {
                return;
            }
            IKafkaMessage kafkaMessage = mapMessage(type, message);

            if (kafkaMessage instanceof KafkaClientWithoutSessionMessage) {
                clientsService.processNewClient((KafkaClientWithoutSessionMessage) kafkaMessage);
            } else if (kafkaMessage instanceof KafkaClientMessage) {
                clientsService.processJoiningClient((KafkaClientMessage) kafkaMessage);
            } else {
            }

        } catch (Exception e) {
            System.err.println("Error processing message");
            e.printStackTrace();
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

    private IKafkaMessage mapMessage(String type, String message) throws JsonProcessingException {
        if (EKafkaMessageClientTypes.NEW_CLIENT.getMessageType().equals(type)) {

            return objectMapper.readValue(message, KafkaClientWithoutSessionMessage.class);
        } else if (EKafkaMessageClientTypes.ADD_CLIENT.getMessageType().equals(type)) {
            return objectMapper.readValue(message, KafkaClientMessage.class);
        } else {
            throw new RuntimeException("Unknown message type: " + type);
        }
    }
}
