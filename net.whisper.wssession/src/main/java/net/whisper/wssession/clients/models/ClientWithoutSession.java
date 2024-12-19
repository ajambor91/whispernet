package net.whisper.wssession.clients.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.wssession.clients.interfaces.IClientWithoutSession;
import net.whisper.wssession.clients.templates.KafkaClientWithoutSessionMessage;

@Getter
@Setter
public class ClientWithoutSession extends BaseClient implements IClientWithoutSession {
    public ClientWithoutSession(KafkaClientWithoutSessionMessage clientWithoutSessionMessage) {
        super(clientWithoutSessionMessage);
    }
}