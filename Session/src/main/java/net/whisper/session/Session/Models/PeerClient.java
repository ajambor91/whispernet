package net.whisper.session.Session.Models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.session.Clients.Models.BaseClient;
import net.whisper.session.Core.Interfaces.IBaseClient;


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
