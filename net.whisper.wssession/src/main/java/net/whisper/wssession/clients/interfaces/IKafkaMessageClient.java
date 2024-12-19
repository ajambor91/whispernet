package net.whisper.wssession.clients.interfaces;

import net.whisper.wssession.core.interfaces.IBaseClient;
import net.whisper.wssession.core.interfaces.IKafkaMessage;

public interface IKafkaMessageClient extends IBaseClient, IKafkaMessage {
    String getSessionToken();
}
