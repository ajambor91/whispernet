package net.whisper.session.Clients.Enums;

public enum EClientConnectionStatus {
    CREATED("created"),
    NOT_CONNECTED("not-connected"),
    CONNECTED("connected"),
    DISCONNECTED_FAIL("disconnected-fail"),
    DISCONNECTED("disconnected");

    private final String statusName;

    EClientConnectionStatus(String statusName) {
        this.statusName = statusName;
    }

    public String getStatusName() {
        return statusName;
    }
}
