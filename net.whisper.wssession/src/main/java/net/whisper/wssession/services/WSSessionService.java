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
import net.whisper.wssession.SessionClients;
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
            Client client = mapToClient(kafkaMessage);
            String userToken = client.getUserToken();
            String sessionToken = UUID.randomUUID().toString();
            wsSessionRepository.saveToken(userToken, sessionToken);
            Client newClient = createWSSession(userToken, sessionToken);
            SessionClients sessionClients = createSessionClients(sessionToken, userToken);
            String jsonNewClient = objectMapper.writeValueAsString(newClient);
            String jsonSessionClients = objectMapper.writeValueAsString(sessionClients);
            sendKafkaMsg(jsonSessionClients, "request-init-ws-session-topic");
            sendKafkaMsg(jsonNewClient, "request-ws-token-topic");
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
            SessionClients tokenCreatedWSession = createSessionClients(wsToken, newWsTokenValue);
            String jsonSession = objectMapper.writeValueAsString(tokenCreatedWSession);
            System.out.println("SENDINS"); 
            System.out.println(jsonSession);
            sendKafkaMsg(jsonSession, "request-init-ws-session-topic");
        } catch (java.lang.Exception e) {
            throw new RuntimeException(e);
        }
    }

    private Client mapToClient(String message)  throws JsonProcessingException {
        return objectMapper.readValue(message, Client.class);
    }

    private TokenWithSessionTemplate mapTokenWithSession(String message)  throws JsonProcessingException {
        return objectMapper.readValue(message, TokenWithSessionTemplate.class);
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

    private SessionClients createSessionClients(String sessionToken, String usersTokens) {
        SessionClients sessionClients = new SessionClients();
        sessionClients.setSessionToken(sessionToken);
        String[] tokensArray = usersTokens.split(",");
        List<Client> clientsList = new ArrayList<>();
        for (int i = 0; i < tokensArray.length; i++) {
            Client client = new Client();
            client.setUserToken(tokensArray[i].trim());
            client.getSession().setSessionToken(sessionToken);
            client.setConnectionStatus(ConnectionStatus.SESSION_TOKEN_CREATED);
            clientsList.add(client);
        }
        sessionClients.setClients(clientsList);
        return sessionClients;

    }

    private String getWsTokenValues(String wsToken) {
        return wsSessionRepository.getToken(wsToken);
    }
}