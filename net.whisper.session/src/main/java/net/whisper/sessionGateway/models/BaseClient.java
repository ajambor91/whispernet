package net.whisper.sessionGateway.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.enums.EClientConnectionStatus;
import net.whisper.sessionGateway.enums.EPeerRole;
import net.whisper.sessionGateway.interfaces.IBaseClient;
import net.whisper.sessionGateway.templates.KafkaClientMessage;

@Getter
@Setter
public abstract class BaseClient implements IBaseClient {
    private String userToken;
    private String userId;
    private EClientConnectionStatus clientConnectionStatus;
    private EPeerRole peerRole;

    public BaseClient() {

    }


    public BaseClient(Client client) {
        this.userToken = client.getUserToken();
        this.userId = client.getUserId();
        this.clientConnectionStatus = client.getClientConnectionStatus();
        this.peerRole = client.getPeerRole();
    }

    public BaseClient(KafkaClientMessage client) {
        this.userToken = client.getUserToken();
        this.userId = client.getUserId();
        this.clientConnectionStatus = client.getClientConnectionStatus();
        this.peerRole = client.getPeerRole();
    }

    public BaseClient(ClientWithoutSession client) {
        this.userToken = client.getUserToken();
        this.userId = client.getUserId();
        this.clientConnectionStatus = client.getClientConnectionStatus();
        this.peerRole = client.getPeerRole();
    }
}
