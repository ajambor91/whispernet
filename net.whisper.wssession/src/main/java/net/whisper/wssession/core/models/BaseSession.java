package net.whisper.wssession.core.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.wssession.session.enums.ESessionStatus;
import net.whisper.wssession.session.models.PeerSession;

import java.io.Serializable;

@Getter
@Setter
public abstract class BaseSession implements Serializable {
    protected String sessionToken;
    protected ESessionStatus sessionStatus;

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
