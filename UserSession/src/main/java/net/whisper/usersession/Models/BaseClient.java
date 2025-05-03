package net.whisper.usersession.Models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.usersession.Enums.EClientConnectionStatus;
import net.whisper.usersession.Enums.EPGPSessionType;
import net.whisper.usersession.Enums.EPeerRole;
import net.whisper.usersession.Interfaces.IBaseClient;


@Getter
@Setter
public abstract class BaseClient extends BasicClient implements IBaseClient {

    private EClientConnectionStatus clientConnectionStatus;
    private EPeerRole peerRole;
    private EPGPSessionType sessionType;

    public BaseClient() {
    }
}
