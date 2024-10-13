package net.whisper.session;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import com.fasterxml.jackson.core.JsonProcessingException;

@Service
public class KafkaService {

    @Autowired
    private ObjectMapper objectMapper;
    private final ConcurrentHashMap<String, BlockingQueue<TokenWithSessionTemplate>> responseMap = new ConcurrentHashMap<>();

    @KafkaListener(topics = "request-ws-token-topic", groupId = "whispernet-group")
    public void listen(String message) {
        TokenWithSessionTemplate userToken = null;
        try {
            userToken = getToken(message);

        } catch (JsonProcessingException  e) {
            throw new RuntimeException(e);
        }
        BlockingQueue<TokenWithSessionTemplate> queue = responseMap.get(userToken.getUserToken());
        if (queue != null) {
            try {
                queue.put(userToken);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    public TokenWithSessionTemplate waitForMessage(String userToken, long timeoutInSeconds) throws InterruptedException {
        BlockingQueue<TokenWithSessionTemplate> queue = responseMap.computeIfAbsent(userToken, k -> new LinkedBlockingQueue<>());
        TokenWithSessionTemplate message = queue.poll(timeoutInSeconds, TimeUnit.SECONDS);
        responseMap.remove(userToken);

        if (message == null) {
            throw new RuntimeException("Timeout: No message received from Kafka for token: " + userToken);
        }
        return message;
    }

    private TokenWithSessionTemplate getToken(String message) throws  JsonProcessingException {
        System.out.println("message");
        System.out.println(message);
        TokenWithSessionTemplate tokenWithSessionTemplate = objectMapper.readValue(message, TokenWithSessionTemplate.class);
        return tokenWithSessionTemplate;
    }
}
