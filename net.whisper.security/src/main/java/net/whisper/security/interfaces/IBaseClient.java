package net.whisper.security.interfaces;

public interface IBaseClient {
    String getUserToken();

    void setUserToken(String userToken);

    String getUserId();

    void setUserId(String userId);
}
