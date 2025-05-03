package net.whisper.wssession.session.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.wssession.core.interfaces.IBaseClient;
import net.whisper.wssession.core.models.BaseClient;

@Getter
@Setter
public class PeerClient extends BaseClient {

    public PeerClient() {
    }

    public PeerClient(IBaseClient userClient) {
        super(userClient);
    }

    public void updatePeer(PeerClient peerClient) {
        if (this.getUserId() == null && peerClient.getUserId() != null) {
            this.setUserId(peerClient.getUserId());
        }
        if (this.getUsername() == null && peerClient.getUsername() != null) {
            this.setUsername(peerClient.getUsername());
        }
        this.setClientConnectionStatus(peerClient.getClientConnectionStatus());
        this.setSessionType(peerClient.getSessionType());
    }
}
