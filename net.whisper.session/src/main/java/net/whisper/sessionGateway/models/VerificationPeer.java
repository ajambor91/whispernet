package net.whisper.sessionGateway.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.IBaseClient;
import net.whisper.sessionGateway.interfaces.IPartner;
import net.whisper.sessionGateway.interfaces.IVerificationPeer;

@Getter
@Setter
public class VerificationPeer extends Partner implements IVerificationPeer {
    private String userId;
    private String userToken;

    public VerificationPeer(IBaseClient client, IPartner partner) {
        this.userId = client.getUserId();
        this.userToken = client.getUserToken();
        this.setPublicKey(partner.getPublicKey());
        this.setUsername(partner.getPublicKey());

    }
}
