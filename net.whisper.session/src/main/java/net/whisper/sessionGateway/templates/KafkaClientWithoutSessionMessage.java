package net.whisper.sessionGateway.templates;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.IKafkaMessageClientWithoutSession;
import net.whisper.sessionGateway.models.BaseClient;
import net.whisper.sessionGateway.models.ClientWithoutSession;

@Setter
@Getter
public class KafkaClientWithoutSessionMessage extends BaseClient implements IKafkaMessageClientWithoutSession {
    public KafkaClientWithoutSessionMessage(ClientWithoutSession client) {
        super(client);
    }
}
