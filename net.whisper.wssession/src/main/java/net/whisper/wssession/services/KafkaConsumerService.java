package net.whisper.wssession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import java.util.UUID;
import net.whisper.wssession.WSSessionService;
import net.whisper.wssession.KafkaTopic;
import org.apache.kafka.clients.consumer.ConsumerRecord;


@Service
public class KafkaConsumerService {

    @Autowired
    private WSSessionService wsSessionService;


    @KafkaListener(topics = {"request-client-topic", "request-joining-client-topic"}, groupId = "whispernet-group")
    public void handleTokenEvent(ConsumerRecord<String, String> record) {
        System.out.println("HO");

        try {
            String topic = record.topic();
            String message = record.value();
            System.out.println(message);
            if (KafkaTopic.CLIENT_TOPIC.getTopicName().equals(topic)) {
                System.out.println("KAFKA PROCESS");
                    wsSessionService.processClient(message);
                } else if (KafkaTopic.CLIENT_JOINING_TOPIC.getTopicName().equals(topic)) {
                // Obsługa dla USER_TOKEN_EXISTS_WSESSION_TOPIC
                wsSessionService.processExistingSession(message);
                System.out.println("KAFGKA ELSE");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}