package net.whisper.sessionGateway.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.IApprovingPeer;
import net.whisper.sessionGateway.interfaces.IBaseClient;
import net.whisper.sessionGateway.interfaces.IPartner;

@Getter
@Setter
public class ApprovingPeer extends Partner implements IApprovingPeer {
    private String userId;
    private String userToken;

    public ApprovingPeer(IBaseClient client, IPartner partner) {
        this.userId = client.getUserId();
        this.userToken = client.getUserToken();
        this.setPublicKey(partner.getPublicKey());
        this.setUsername(partner.getPublicKey());

    }
}
