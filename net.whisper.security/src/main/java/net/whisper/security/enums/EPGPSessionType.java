package net.whisper.security.enums;

public enum EPGPSessionType {

    SIGNED("signed"),
    CHECK_RESPONDER("check-responder"),
    SIGNED_INITIATOR("signed-initiator"),
    WAITING_FOR_SIGNED("waiting-for-signed"),
    UNSIGNED("unsigned");

    public final String sessionPGPStatus;

    EPGPSessionType(String sessionPGPStatus) {
        this.sessionPGPStatus = sessionPGPStatus;
    }


}
