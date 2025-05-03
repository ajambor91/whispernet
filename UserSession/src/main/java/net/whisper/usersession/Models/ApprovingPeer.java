package net.whisper.usersession.Models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.usersession.Interfaces.IApprovingPeer;
import net.whisper.usersession.Interfaces.IBaseClient;
import net.whisper.usersession.Interfaces.IPartner;

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
