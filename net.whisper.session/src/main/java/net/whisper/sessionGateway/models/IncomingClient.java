package net.whisper.sessionGateway.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.IClient;
import net.whisper.sessionGateway.templates.KafkaClientMessage;

@Getter
@Setter
public class Client extends BaseClient implements IClient {
    String sessionToken;
    String secretKey;
    public Client() {

    }

    public Client(KafkaClientMessage kafkaClientMessage) {
        super(kafkaClientMessage);
        this.sessionToken = kafkaClientMessage.getSessionToken();
    }
}