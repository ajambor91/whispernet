package net.whisper.session.Clients.Enums;

public enum EPeerRole {
    INITIATOR("initiator"),
    JOINER("joiner");


    private final String peerRoleName;

    EPeerRole(String peerRoleName) {
        this.peerRoleName = peerRoleName;
    }

    public String getPeerRoleName() {
        return peerRoleName;
    }
}