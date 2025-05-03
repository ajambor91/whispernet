package net.whisper.sessionGateway.interfaces;

import net.whisper.sessionGateway.enums.EPGPSessionType;

public interface IBasicClient {
    String getUserToken();

    void setUserToken(String userToken);

    String getUserId();

    void setUserId(String userId);

    EPGPSessionType getSessionType();

    void setSessionType(EPGPSessionType sessionType);

    String getUsername();

    void setUsername(String username);
}
