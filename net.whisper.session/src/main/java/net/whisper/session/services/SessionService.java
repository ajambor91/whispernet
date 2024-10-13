package net.whisper.session;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import net.whisper.session.SessionRepository;
import net.whisper.session.TokenTemplate;
import net.whisper.session.TokenWithSessionTemplate;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import net.whisper.session.KafkaService;
@Service
public class SessionService {
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private KafkaService kafkaService;
    public TokenWithSessionTemplate createUserSession() {
        try {
            String token = createUserSessionToken();
            sessionRepository.saveToken(token);
            TokenTemplate tokenTemplate = createTokenTemplate(token);

            String jsonSession = objectMapper.writeValueAsString(tokenTemplate);
            sendKafkaMsg(jsonSession, "request-user-token-topic");
            TokenWithSessionTemplate tokenWithSessionTemplate = kafkaService.waitForMessage(token, 5);
//            String response = objectMapper.writeValueAsString(tokenWithSessionTemplate);
            return tokenWithSessionTemplate;
        } catch (java.lang.Exception e) {
            throw new RuntimeException(e);
        }

    }

    public TokenWithSessionTemplate createUserSessionForExistingWSession(String wsToken) {
        try {
            String token = createUserSessionToken();
            TokenWithSessionTemplate tokenTemplate = createTokenWithExistedWSessionTemplate(token, wsToken);
            String jsonSession = objectMapper.writeValueAsString(tokenTemplate);
            sendKafkaMsg(jsonSession, "request-user-token-exists-wsession-topic");

            return tokenTemplate;
        } catch (java.lang.Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String createUserSessionToken() {
        String token = UUID.randomUUID().toString();
        try {
            sessionRepository.saveToken(token);
            return token;
        } catch (java.lang.Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void sendKafkaMsg(String parsedObject, String topic){
        Message<String> message = MessageBuilder
                .withPayload(parsedObject)
                .setHeader(KafkaHeaders.TOPIC, topic)
                .setHeader("type", "Token")
                .build();
        kafkaTemplate.send(message);

    }

    private TokenTemplate createTokenTemplate(String token) {
        TokenTemplate tokenTemplate = new TokenTemplate();
        tokenTemplate.setUserToken(token);
        return tokenTemplate;
    }

    private TokenWithSessionTemplate createTokenWithExistedWSessionTemplate(String token, String wToken) {
        TokenWithSessionTemplate template = new TokenWithSessionTemplate();
        template.setWSessionToken(wToken);
        template.setUserToken(token);
        return template;
    }
}