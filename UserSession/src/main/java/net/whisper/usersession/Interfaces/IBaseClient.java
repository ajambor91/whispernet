package net.whisper.usersession.Interfaces;

import net.whisper.usersession.Enums.EClientConnectionStatus;
import net.whisper.usersession.Enums.EPGPSessionType;
import net.whisper.usersession.Enums.EPeerRole;

public interface IBaseClient extends IBasicClient {


    EClientConnectionStatus getClientConnectionStatus();

    void setClientConnectionStatus(EClientConnectionStatus clientConnectionStatus);

    EPeerRole getPeerRole();

    void setPeerRole(EPeerRole peerRole);

    EPGPSessionType getSessionType();

    void setSessionType(EPGPSessionType sessionType);
}
