package net.whisper.security.interfaces;

import net.whisper.security.enums.EPGPSessionType;

public interface IBaseClient {
    String getUserToken();

    void setUserToken(String userToken);

    String getUserId();

    void setUserId(String userId);

    EPGPSessionType getClientPGPType();

    void setClientPGPType(EPGPSessionType clientPGPType);

}
