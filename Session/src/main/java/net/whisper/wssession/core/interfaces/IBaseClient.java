package net.whisper.wssession.core.interfaces;


import net.whisper.wssession.clients.enums.EClientConnectionStatus;
import net.whisper.wssession.clients.enums.EPeerRole;
import net.whisper.wssession.core.enums.EPGPSessionType;

public interface IBaseClient {
    String getUserToken();

    void setUserToken(String userToken);

    String getUserId();

    void setUserId(String userId);

    EClientConnectionStatus getClientConnectionStatus();

    void setClientConnectionStatus(EClientConnectionStatus clientConnectionStatus);

    EPeerRole getPeerRole();

    void setPeerRole(EPeerRole peerRole);

    EPGPSessionType getSessionType();

    void setSessionType(EPGPSessionType sessionType);

    String getUsername();

    void setUsername(String username);
}
