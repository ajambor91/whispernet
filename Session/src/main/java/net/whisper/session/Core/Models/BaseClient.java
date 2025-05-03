package net.whisper.session.Core.Models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.session.Clients.Enums.EClientConnectionStatus;
import net.whisper.session.Clients.Enums.EPeerRole;
import net.whisper.session.Core.Enums.EPGPSessionType;
import net.whisper.session.Core.Interfaces.IBaseClient;


import java.io.Serializable;

@Getter
@Setter
public abstract class BaseClient implements Serializable, IBaseClient {
    private String userToken;
    private String userId;
    private EPeerRole peerRole;
    private EClientConnectionStatus clientConnectionStatus;
    private EPGPSessionType sessionType;
    private String username;


    public BaseClient() {
    }

    public BaseClient(IBaseClient client) {
        this.userToken = client.getUserToken();
        this.userId = client.getUserId();
        this.peerRole = client.getPeerRole();
        this.clientConnectionStatus = client.getClientConnectionStatus();
        this.sessionType = client.getSessionType();
        this.username = client.getUsername();
    }
}
