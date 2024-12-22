package net.whisper.wssession.session.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.wssession.core.models.BaseSession;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class PeerSession extends BaseSession {
    private List<PeerClient> peerClients = new ArrayList<>();
    private String secretKey;

    public PeerSession() {
    }

    public PeerSession(String sessionToken, String secretKey) {
        super(sessionToken);
        this.secretKey = secretKey;
    }

    public void addPeerClient(PeerClient peerClient) {
        peerClients.add(peerClient);
    }
}