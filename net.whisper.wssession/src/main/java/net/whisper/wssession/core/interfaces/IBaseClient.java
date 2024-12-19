package net.whisper.wssession.core.interfaces;


import net.whisper.wssession.clients.enums.EClientConnectionStatus;
import net.whisper.wssession.clients.enums.EPeerRole;

public interface IBaseClient {
    String getUserToken();

    void setUserToken(String userToken);

    String getUserId();

    void setUserId(String userId);

    EClientConnectionStatus getClientConnectionStatus();

    void setClientConnectionStatus(EClientConnectionStatus clientConnectionStatus);

    EPeerRole getPeerRole();

    void setPeerRole(EPeerRole peerRole);
}
