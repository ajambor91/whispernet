package net.whisper.sessionGateway.interfaces;

import net.whisper.sessionGateway.enums.EClientConnectionStatus;
import net.whisper.sessionGateway.enums.EPeerRole;

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
