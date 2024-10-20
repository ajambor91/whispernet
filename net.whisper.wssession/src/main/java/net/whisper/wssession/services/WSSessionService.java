package net.whisper.wssession;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import net.whisper.wssession.WSSessionRepository;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import net.whisper.wssession.TokenWithSessionTemplate;
import net.whisper.wssession.TokenTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import net.whisper.wssession.TokenCreatedWSession;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;

@Component
public class WSSessionService {
    @Autowired
    private WSSessionRepository wsSessionRepository;
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void processToken(String kafkaMessage) {

        try {
            String userToken = mapToken(kafkaMessage).getUserToken();
            String wsToken = UUID.randomUUID().toString();
            wsSessionRepository.saveToken(userToken, wsToken);
            TokenWithSessionTemplate tokenTemplate = createWSessionTokenTemplate(userToken, wsToken);
            TokenCreatedWSession tokenCreatedWSession = createCreatedSessionTokenObject(wsToken, userToken);
            String jsonSession = objectMapper.writeValueAsString(tokenTemplate);
            String jsonCreatedSession = objectMapper.writeValueAsString(tokenCreatedWSession);
            sendKafkaMsg(jsonCreatedSession, "request-ws-startws-topic");
            sendKafkaMsg(jsonSession, "request-ws-token-topic");
        } catch (java.lang.Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void processExistingSession(String kafkaMessage)  {

        try {
            TokenWithSessionTemplate template = mapTokenWithSession(kafkaMessage);
            String userToken = template.getUserToken();
            String wsToken = template.getWSessionToken();
            String wsTokenValue = getWsTokenValues(wsToken);
            if (wsTokenValue == null) {
                return;
            }
            String newWsTokenValue = wsTokenValue + "," + userToken;
            wsSessionRepository.saveToken(newWsTokenValue, wsToken);
            TokenCreatedWSession tokenCreatedWSession = createCreatedSessionTokenObject(wsToken, newWsTokenValue);
            String jsonSession = objectMapper.writeValueAsString(tokenCreatedWSession);
            System.out.println("SENDINS"); 
            System.out.println(jsonSession);
            sendKafkaMsg(jsonSession, "request-ws-startws-topic");
        } catch (java.lang.Exception e) {
            throw new RuntimeException(e);
        }
    }

    private TokenTemplate mapToken(String message)  throws JsonProcessingException {
        return objectMapper.readValue(message, TokenTemplate.class);
    }

    private TokenWithSessionTemplate mapTokenWithSession(String message)  throws JsonProcessingException {
        return objectMapper.readValue(message, TokenWithSessionTemplate.class);
    }

    private TokenWithSessionTemplate createWSessionTokenTemplate(String token, String sessionToken) {
        TokenWithSessionTemplate tokenTemplate = new TokenWithSessionTemplate();
        tokenTemplate.setUserToken(token);
        tokenTemplate.setWSessionToken(sessionToken);
        return tokenTemplate;
    }

    private void sendKafkaMsg(String parsedObject, String topic){
        Message<String> message = MessageBuilder
                .withPayload(parsedObject)
                .setHeader(KafkaHeaders.TOPIC, topic)
                .setHeader("type", "Token")
                .build();
        kafkaTemplate.send(message);

    }

    private TokenCreatedWSession createCreatedSessionTokenObject(String wsToken, String usersTokens) {
        TokenCreatedWSession createdSession = new TokenCreatedWSession();
        String[] tokensArray = usersTokens.split(",");
        for (int i = 0; i < tokensArray.length; i++) {
            tokensArray[i] = tokensArray[i].trim();
        }
        List<String> userTokensList = Arrays.asList(tokensArray);
        createdSession.setWsSessionToken(wsToken);
        createdSession.setUsersTokens(userTokensList);
        return createdSession;

    }

    private String getWsTokenValues(String wsToken) {
        return wsSessionRepository.getToken(wsToken);
    }
}