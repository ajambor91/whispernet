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
        if (peerClients.stream().noneMatch(existingPeer -> existingPeer.getUserId().equals(peerClient.getUserId()))) {
            peerClients.add(peerClient);
        } else {
            throw new IllegalArgumentException(String.format("PeerClient is duplicated when adding to session, sessionToken=%s", this.sessionToken));
        }
    }
}