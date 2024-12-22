package net.whisper.sessionGateway.templates;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.IKafkaMessage;
import net.whisper.sessionGateway.interfaces.IKafkaMessageClient;
import net.whisper.sessionGateway.models.BaseClient;
import net.whisper.sessionGateway.models.Client;

@Setter
@Getter
public class KafkaIncomingClientMessage extends BaseClient implements IKafkaMessage, IKafkaMessageClient {
    String sessionToken;
    String secretKey;

    public KafkaIncomingClientMessage() {
    }

    public KafkaIncomingClientMessage(Client client) {
        super(client);
        this.sessionToken = client.getSessionToken();
    }
}
