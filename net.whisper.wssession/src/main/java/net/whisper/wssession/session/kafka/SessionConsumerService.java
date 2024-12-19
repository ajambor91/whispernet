package net.whisper.wssession.session.kafka;

import net.whisper.wssession.core.coordinatos.ClientSessionCoordinator;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;


@Service
public class SessionConsumerService {
    @Autowired
    private ClientSessionCoordinator wsSessionService;


    @KafkaListener(topics = {"request-session-update-topic", "request-session-remove-topic"}, groupId = "whispernet-wsession-session-group")
    public void handleTokenEvent(ConsumerRecord<String, String> record) {
        try {
            String topic = record.topic();
            String message = record.value();


        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}