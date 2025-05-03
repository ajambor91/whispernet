package net.whisper.session.Core.Models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.session.Core.Enums.EPGPSessionType;
import net.whisper.session.Session.Enums.ESessionStatus;
import net.whisper.session.Session.Models.PeerSession;


import java.io.Serializable;

@Getter
@Setter
public abstract class BaseSession implements Serializable {
    protected String sessionToken;
    protected ESessionStatus sessionStatus;
    protected EPGPSessionType pgpSessionType;

    public BaseSession() {
    }

    public BaseSession(String sessionToken) {

        this.sessionToken = sessionToken;
        this.sessionStatus = ESessionStatus.CREATED;
    }

    public BaseSession(PeerSession peerSession) {
        this.sessionToken = peerSession.sessionToken;
        this.sessionStatus = peerSession.sessionStatus;
    }

}
