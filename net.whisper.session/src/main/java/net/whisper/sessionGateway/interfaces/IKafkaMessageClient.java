package net.whisper.sessionGateway.interfaces;

public interface IKafkaMessageClient extends IBaseClient {
    String getSessionToken();
}
