package net.whisper.usersession.Models;

import lombok.Getter;
import net.whisper.usersession.Interfaces.IApprovingPeer;
import net.whisper.usersession.Interfaces.IApprovingSession;

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
