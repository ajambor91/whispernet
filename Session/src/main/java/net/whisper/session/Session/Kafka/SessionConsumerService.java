package net.whisper.session.Session.Kafka;

import com.fasterxml.jackson.databind.ObjectMapper;

import net.whisper.session.Session.Enums.EKafkaMessageSessionTypes;
import net.whisper.session.Session.Models.ApprovingSession;
import net.whisper.session.Session.Models.PeerSession;
import net.whisper.session.Session.Services.SessionService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;


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

    @KafkaListener(topics = {"request-Session-signal-topic"}, groupId = "whispernet-wsession-Session-group")
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
                this.logger.warn("Message header not known - SessionConsumerService:handleTokenEvent");
            }

        } catch (Exception e) {
            this.logger.error("Processing message error - SessionConsumerService:handleTokenEvent");

        }
    }

    @KafkaListener(topics = {"request-Session-approving-topic"}, groupId = "whispernet-wsession-Session-approving-group")
    public void handleApprovingEvent(ConsumerRecord<String, String> record) {
        try {
            String type = this.getHeaderValue(record, "type");
            String message = record.value();
            ApprovingSession session = this.objectMapper.readValue(message, ApprovingSession.class);
            if (EKafkaMessageSessionTypes.ACCEPT_SESSION.getMessageType().equals(type)) {
                this.sessionService.acceptSession(session);
            } else if (EKafkaMessageSessionTypes.REMOVE_SESSION.getMessageType().equals(type)) {
                this.sessionService.removeSession(session);
            } else {
                this.logger.warn("Message header from approving service not known - SessionConsumerService:handleTokenEvent");
            }

        } catch (Exception e) {
            this.logger.error("Processing message error - SessionConsumerService:handleTokenEvent");

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
}