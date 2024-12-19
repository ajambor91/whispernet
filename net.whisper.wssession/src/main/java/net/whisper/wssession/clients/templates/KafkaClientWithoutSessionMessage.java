package net.whisper.wssession.clients.templates;

import lombok.Getter;
import lombok.Setter;
import net.whisper.wssession.clients.interfaces.IKafkaMessageClientWithoutSession;
import net.whisper.wssession.clients.models.BaseClient;
import net.whisper.wssession.clients.models.ClientWithoutSession;


@Setter
@Getter
public class KafkaClientWithoutSessionMessage extends BaseClient implements IKafkaMessageClientWithoutSession {
    public KafkaClientWithoutSessionMessage() {
    }

    public KafkaClientWithoutSessionMessage(ClientWithoutSession client) {
        super(client);
    }
}
