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
import net.whisper.wssession.Session;
import net.whisper.wssession.Client;
import net.whisper.wssession.ConnectionStatus;

@Component
public class WSSessionService {
    @Autowired
    private WSSessionRepository wsSessionRepository;
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void processClient(String kafkaMessage) {

        try {
            Client client = mapMessageToClient(kafkaMessage);
            String userToken = client.getUserToken();
            String sessionToken = UUID.randomUUID().toString();
            wsSessionRepository.saveToken(sessionToken, userToken);
            client.getSession().setSessionToken(sessionToken);
            client.setConnectionStatus(ConnectionStatus.SESSION_TOKEN_CREATED.getStatusName());
            String jsonNewClient = objectMapper.writeValueAsString(client);
            sendKafkaMsg(jsonNewClient, "request-init-ws-session-topic");
            sendKafkaMsg(jsonNewClient, "request-ws-token-topic");
        } catch (java.lang.Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void processExistingSession(String kafkaMessage)  {

        try {
            Client client = mapMessageToClient(kafkaMessage);
            String userToken = client.getUserToken();
            String sessionToken = client.getSession().getSessionToken();
            String sessionTokenValue = getSessionTokenValue(sessionToken);
            System.out.println("sessionToken" + sessionToken);
            System.out.println("sessionTokenValue" + sessionTokenValue);
            if (sessionTokenValue == null) {
                return;
            }
            String newSessionTokenValue = sessionTokenValue + "," + userToken;
            wsSessionRepository.saveToken(sessionToken, newSessionTokenValue);
            client.getSession().setSessionToken(sessionToken);
            client.setConnectionStatus(ConnectionStatus.SESSION_TOKEN_CREATED.getStatusName());
            String jsonClient = objectMapper.writeValueAsString(client);
            System.out.println("SENDINS"); 
            System.out.println(jsonClient);
            sendKafkaMsg(jsonClient, "request-init-ws-session-topic");
        } catch (java.lang.Exception e) {
            System.out.println("EXCEPTION");
            System.out.println(e);
            throw new RuntimeException(e);
        }
    }

    private Client mapMessageToClient(String message)  throws JsonProcessingException {
        return objectMapper.readValue(message, Client.class);
    }

    private Client createWSSession(String userToken, String sessionToken) {
        Client client = new Client();
        client.setUserToken(userToken);
        client.getSession().setSessionToken(sessionToken);
        return client;
    }

    private void sendKafkaMsg(String parsedObject, String topic){
        Message<String> message = MessageBuilder
                .withPayload(parsedObject)
                .setHeader(KafkaHeaders.TOPIC, topic)
                .setHeader("type", "Token")
                .build();
        kafkaTemplate.send(message);

    }

    private String getSessionTokenValue(String sessionToken) {
        return wsSessionRepository.getToken(sessionToken);
    }
}