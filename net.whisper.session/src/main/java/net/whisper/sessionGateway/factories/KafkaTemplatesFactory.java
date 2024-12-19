package net.whisper.sessionGateway.factories;

import net.whisper.sessionGateway.models.Client;
import net.whisper.sessionGateway.models.ClientWithoutSession;
import net.whisper.sessionGateway.templates.KafkaClientMessage;
import net.whisper.sessionGateway.templates.KafkaClientWithoutSessionMessage;

public class KafkaTemplatesFactory {

    public static KafkaClientWithoutSessionMessage createNewClientTemplate(ClientWithoutSession clientWithoutSessionMessage) {
        return new KafkaClientWithoutSessionMessage(clientWithoutSessionMessage);
    }

    public static KafkaClientMessage creatJoinClientTemplate(Client client) {
        return new KafkaClientMessage(client);
    }
}
