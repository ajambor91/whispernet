package net.whisper.sessionGateway.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.IIncomingClient;
import net.whisper.sessionGateway.templates.KafkaIncomingClientMessage;

@Getter
@Setter
public class IncomingClient extends BaseClient implements IIncomingClient {
    String sessionToken;
    String secretKey;

    public IncomingClient() {

    }

    public IncomingClient(KafkaIncomingClientMessage kafkaClientMessage) {
        super(kafkaClientMessage);
        this.sessionToken = kafkaClientMessage.getSessionToken();
        this.secretKey = kafkaClientMessage.getSecretKey();
    }
}