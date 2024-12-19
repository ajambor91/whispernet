package net.whisper.sessionGateway.templates;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.IKafkaMessage;
import net.whisper.sessionGateway.interfaces.IKafkaMessageClient;
import net.whisper.sessionGateway.models.BaseClient;
import net.whisper.sessionGateway.models.Client;

@Setter
@Getter
public class KafkaClientMessage extends BaseClient implements IKafkaMessage, IKafkaMessageClient {
    String sessionToken;

    public KafkaClientMessage() {
    }

    public KafkaClientMessage(Client client) {
        super(client);
        this.sessionToken = client.getSessionToken();
    }
}
