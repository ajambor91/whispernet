package net.whisper.sessionGateway.models;

import lombok.Getter;
import net.whisper.sessionGateway.interfaces.IBaseClient;
import net.whisper.sessionGateway.interfaces.IPartner;
import net.whisper.sessionGateway.interfaces.IVerification;
import net.whisper.sessionGateway.interfaces.IVerificationPeer;

import java.util.ArrayList;
import java.util.List;

@Getter
public class Verification implements IVerification {
    private final String initiatorId;
    private final List<IVerificationPeer> peers;

    public Verification(IBaseClient initiator) {
        this.initiatorId = initiator.getUserId();
        this.peers = new ArrayList<>();
    }

    private void addPeer(IBaseClient client, IPartner partner) {
        this.peers.add(new VerificationPeer(client, partner));
    }
}
