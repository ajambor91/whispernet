package net.whisper.sessionGateway.interfaces;

public interface IBasicClient {
    String getUserToken();

    void setUserToken(String userToken);

    String getUserId();

    void setUserId(String userId);
}
