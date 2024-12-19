package net.whisper.wssession.clients.templates;

import lombok.Getter;
import lombok.Setter;
import net.whisper.wssession.clients.interfaces.IKafkaMessageClient;
import net.whisper.wssession.core.models.BaseClient;


@Setter
@Getter
public class KafkaClientMessage extends BaseClient implements IKafkaMessageClient {
    String sessionToken;
}
