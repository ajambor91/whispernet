package net.whisper.wssession.clients.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.wssession.clients.interfaces.IClient;
import net.whisper.wssession.session.models.PeerClient;
import net.whisper.wssession.session.models.PeerSession;


@Getter
@Setter
public class Client extends BaseClient implements IClient {
    String sessionToken;
    String secretKey;
    public Client() {

    }

    public Client(PeerClient peerClient, PeerSession peerSession) {
        super(peerClient);
        this.sessionToken = peerSession.getSessionToken();
        this.secretKey = peerSession.getSecretKey();
    }
}