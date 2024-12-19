package net.whisper.wssession.clients.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.wssession.clients.enums.EClientConnectionStatus;
import net.whisper.wssession.clients.enums.EPeerRole;
import net.whisper.wssession.core.interfaces.IBaseClient;


@Getter
@Setter
public abstract class BaseClient implements IBaseClient {
    private String userToken;
    private String userId;
    private EClientConnectionStatus clientConnectionStatus;
    private EPeerRole peerRole;

    public BaseClient() {

    }

    public BaseClient(IBaseClient client) {
        this.userToken = client.getUserToken();
        this.userId = client.getUserId();
        this.clientConnectionStatus = client.getClientConnectionStatus();
        this.peerRole = client.getPeerRole();
    }
}
