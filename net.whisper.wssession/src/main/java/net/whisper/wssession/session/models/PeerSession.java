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


    public PeerSession() {
    }

    public PeerSession(String sessionToken) {
        super(sessionToken);
    }

    public void addPeerClient(PeerClient peerClient) {
        peerClients.add(peerClient);
    }
}