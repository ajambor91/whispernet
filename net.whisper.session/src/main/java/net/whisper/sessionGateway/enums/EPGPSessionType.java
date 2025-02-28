package net.whisper.sessionGateway.enums;

public enum EPGPSessionType {
    VERIFIED("verified"),
    SIGNED("signed"),
    WAITING_FOR_PEER_ACCEPTED("waiting-for-peer-accepted"),
    CHECK_RESPONDER("check-responder"),
    CHECK_REQuEST("check-request"),
    SIGNED_INITIATOR("signed-initiator"),
    WAITING_FOR_SIGNED("waiting-for-signed"),
    UNSIGNED("unsigned");

    public final String sessionPGPStatus;

    EPGPSessionType(String sessionPGPStatus) {
        this.sessionPGPStatus = sessionPGPStatus;
    }

    public static EPGPSessionType fromValue(String value) {
        for (EPGPSessionType enumValue : EPGPSessionType.values()) {
            if (enumValue.getSessionPGPStatus().equals(value)) {
                return enumValue;
            }
        }
        throw new IllegalArgumentException("Unknown enum value: " + value);
    }

    public String getSessionPGPStatus() {
        return this.sessionPGPStatus;
    }

}
