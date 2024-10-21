package net.whisper.session;

public enum ConnectionStatus {
    INIT("init"),
    SESSION_TOKEN_CREATED("session-token-created"),
    NOT_CONNECTED("not-connected"),
    WAITING_FOR_PEER("waiting-for-peer"),
    WAITING("waiting"),
    PREPARE("prepare"),
    READY("ready"),
    SET("set");


    private final String statusName;

    ConnectionStatus(String statusName) {
        this.statusName = statusName;
    }

    public String getStatusName() {
        return statusName;
    }
}
