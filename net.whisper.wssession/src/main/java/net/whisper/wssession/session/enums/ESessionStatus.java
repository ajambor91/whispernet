package net.whisper.wssession.session.enums;

public enum ESessionStatus {
    CREATED("created"),
    INITIALIZED("initialized"),
    PEERS_CONNECTED("peers-connected"),
    INTERRUPTED("interrupted"),
    DISCONNECTED("disconnected");

    private final String sessionStatus;

    ESessionStatus(String sessionStatus) {
        this.sessionStatus = sessionStatus;
    }

    public String getSessionStatus() {
        return sessionStatus;
    }
}