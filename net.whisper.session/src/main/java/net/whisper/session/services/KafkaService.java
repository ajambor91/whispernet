package net.whisper.session;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import net.whisper.session.Client;
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
    private final ConcurrentHashMap<String, BlockingQueue<Client>> responseMap = new ConcurrentHashMap<>();

    @KafkaListener(topics = "request-ws-token-topic", groupId = "whispernet-group")
    public void listen(String message) {
        Client client = null;
        try {
            client = getClient(message);

        } catch (JsonProcessingException  e) {
            throw new RuntimeException(e);
        }
        BlockingQueue<Client> queue = responseMap.get(client.getUserToken());
        if (queue != null) {
            try {
                queue.put(client);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    public Client waitForMessage(Client client, long timeoutInSeconds) throws InterruptedException {
        BlockingQueue<Client> queue = responseMap.computeIfAbsent(client.getUserToken(), k -> new LinkedBlockingQueue<>());
        Client message = queue.poll(timeoutInSeconds, TimeUnit.SECONDS);
        responseMap.remove(client.getUserToken());

        if (message == null) {
            throw new RuntimeException("Timeout: No message received from Kafka for token: " + client.getUserToken());
        }
        return message;
    }

    private Client getClient(String message) throws  JsonProcessingException {
        System.out.println("message");
        System.out.println(message);
        Client client = objectMapper.readValue(message, Client.class);
        return client;
    }
}
