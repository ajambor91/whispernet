package net.whisper.wssession.session.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.wssession.session.enums.EKafkaMessageSessionTypes;
import net.whisper.wssession.session.models.PeerSession;
import net.whisper.wssession.session.services.SessionService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;


@Service
public class SessionConsumerService {

    private final ObjectMapper objectMapper;
    private final SessionService sessionService;
    private final Logger logger;
    @Autowired
    public SessionConsumerService(SessionService sessionService, ObjectMapper objectMapper) {
        this.sessionService = sessionService;
        this.objectMapper = objectMapper;
        this.logger = LoggerFactory.getLogger(SessionConsumerService.class);
    }
    @KafkaListener(topics = {"request-session-signal-topic"}, groupId = "whispernet-wsession-session-group")
    public void handleTokenEvent(ConsumerRecord<String, String> record) {

        try {
            String type = this.getHeaderValue(record, "type");
            String message = record.value();
            PeerSession peerSession = this.objectMapper.readValue(message, PeerSession.class);
            if (EKafkaMessageSessionTypes.DISCONNECT_USER.getMessageType().equals(type)) {
                this.sessionService.updateSession(peerSession);
            } else if (EKafkaMessageSessionTypes.REMOVE_USER.getMessageType().equals(type)) {
                this.sessionService.removeClientFromSession(peerSession);
            } else {
                this.logger.warn("Message header not known");
            }


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