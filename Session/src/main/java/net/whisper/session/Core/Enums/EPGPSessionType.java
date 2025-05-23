package net.whisper.session.Core.Enums;

public enum EPGPSessionType {
    VERIFIED("verified"),
    SIGNED("signed"),
    CHECK_RESPONDER("check-responder"),
    SIGNED_INITIATOR("signed-initiator"),
    WAITING_FOR_PEER_ACCEPTED("waiting-for-peer-accepted"),
    WAITING_FOR_SIGNED("waiting-for-signed"),
    PEER_ACCEPTED("peer-accepted"),
    UNSIGNED("unsigned");

    public final String sessionPGPStatus;

    EPGPSessionType(String sessionPGPStatus) {
        this.sessionPGPStatus = sessionPGPStatus;
    }


}
