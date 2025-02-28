package net.whisper.sessionGateway.models;

import lombok.Getter;
import net.whisper.sessionGateway.interfaces.IBaseClient;
import net.whisper.sessionGateway.interfaces.IPartner;
import net.whisper.sessionGateway.interfaces.IApprovingSession;
import net.whisper.sessionGateway.interfaces.IApprovingPeer;

import java.util.ArrayList;
import java.util.List;

@Getter
public class ApprovingSession implements IApprovingSession, IApprovingPeer {
    private final String sessionToken;
    private final String userId;
    private final String userToken;

    public ApprovingSession(IncomingClient peer) {
        this.sessionToken = peer.getSessionToken();
        this.userId = peer.getUserId();
        this.userToken = peer.getUserToken();
    }
}
