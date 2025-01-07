package net.whisper.wssession.session.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ESessionStatus {
    CREATED("created"),
    INITIALIZED("initialized"),
    PEERS_CONNECTED("peers-connected"),
    INTERRUPTED("interrupted"),
    BREAK("break"),
    DISCONNECTED("disconnected");

    private final String sessionStatus;

    ESessionStatus(String sessionStatus) {
        this.sessionStatus = sessionStatus;
    }

    @JsonValue
    public String getSessionStatus() {
        return sessionStatus;
    }

    @JsonCreator
    public static ESessionStatus fromString(String value) {
        for (ESessionStatus status : values()) {
            if (status.sessionStatus.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status" + value);
    }
}