package net.whisper.wssession.session.kafka;

import net.whisper.wssession.core.coordinatos.ClientSessionCoordinator;
import net.whisper.wssession.session.managers.SessionManager;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;


@Service
public class SessionConsumerService {

    private final SessionManager sessionManager;
    private final Logger logger;
    @Autowired
    public SessionConsumerService(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
        this.logger = LoggerFactory.getLogger(SessionConsumerService.class);
    }
    @KafkaListener(topics = {"request-session-signal-topic"}, groupId = "whispernet-wsession-session-group")
    public void handleTokenEvent(ConsumerRecord<String, String> record) {

        try {
//            String type = this.getHeaderValue(record, "type");
//            String message = record.value();
            System.out.println("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
            System.out.println(record.value());


        } catch (Exception e) {
            System.out.println(e.getMessage());

        }
    }

    private String getHeaderValue(ConsumerRecord<String, String> record, String headerKey) {
        if (record.headers() != null) {
            return record.headers().lastHeader(headerKey) != null
                    ? new String(record.headers().lastHeader(headerKey).value())
                    : null;
        }
        return null;
    }}