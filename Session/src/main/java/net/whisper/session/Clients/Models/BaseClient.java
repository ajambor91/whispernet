package net.whisper.session.Clients.Models;

import lombok.Getter;
import lombok.Setter;

import net.whisper.session.Clients.Enums.EClientConnectionStatus;
import net.whisper.session.Clients.Enums.EPeerRole;
import net.whisper.session.Core.Enums.EPGPSessionType;
import net.whisper.session.Core.Interfaces.IBaseClient;


@Getter
@Setter
public abstract class BaseClient implements IBaseClient {
    private String userToken;
    private String userId;
    private EClientConnectionStatus clientConnectionStatus;
    private EPeerRole peerRole;
    private EPGPSessionType sessionType;
    private String username;

    public BaseClient() {

    }

    public BaseClient(IBaseClient client) {
        this.userToken = client.getUserToken();
        this.userId = client.getUserId();
        this.clientConnectionStatus = client.getClientConnectionStatus();
        this.peerRole = client.getPeerRole();
        this.username = client.getUsername();
    }
}
