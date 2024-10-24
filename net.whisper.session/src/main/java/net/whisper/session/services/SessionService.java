package net.whisper.session;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import net.whisper.session.SessionRepository;
import net.whisper.session.Client;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import net.whisper.session.KafkaService;
import net.whisper.session.ConnectionStatus;
import net.whisper.session.PeerRole;
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
    public Client createClient() {
        try {
            String token = createUserSessionToken();
            sessionRepository.saveToken(token);
            Client client = createClient(token);

            String jsonSession = objectMapper.writeValueAsString(client);
            sendKafkaMsg(jsonSession, "request-client-topic");
            Client newClient = kafkaService.waitForMessage(client, 5);
//            String response = objectMapper.writeValueAsString(tokenWithSessionTemplate);
            return newClient;
        } catch (java.lang.Exception e) {
            throw new RuntimeException(e);
        }

    }

    public Client createNextClientSession(String sessionToken) {
        try {
            String userToken = createUserSessionToken();
            Client client = createTokenWithExistedWSessionTemplate(userToken, sessionToken);
            String jsonSession = objectMapper.writeValueAsString(client);
            sendKafkaMsg(jsonSession, "request-joining-client-topic");

            return client;
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

    private Client createClient(String token) {
        String userId = UUID.randomUUID().toString();
        Client client = new Client();
        client.setUserToken(token);
        client.setUserId(userId);
        client.setConnectionStatus(ConnectionStatus.INIT.getStatusName());
        client.setPeerRole(PeerRole.INITIATOR.getPeerRoleName());
        return client;
    }

    private Client createTokenWithExistedWSessionTemplate(String userToken, String sessionToken) {
        String userId = UUID.randomUUID().toString();
        Client client = new Client();
        client.getSession().setSessionToken(sessionToken);
        client.setUserId(userId);
        client.setUserToken(userToken);
        client.setConnectionStatus(ConnectionStatus.INIT.getStatusName());
        client.setPeerRole(PeerRole.JOINER.getPeerRoleName());
        return client;
    }
}