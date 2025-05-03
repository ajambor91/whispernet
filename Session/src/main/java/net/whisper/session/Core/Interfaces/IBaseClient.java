package net.whisper.session.Core.Interfaces;


import net.whisper.session.Clients.Enums.EClientConnectionStatus;
import net.whisper.session.Clients.Enums.EPeerRole;
import net.whisper.session.Core.Enums.EPGPSessionType;

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
