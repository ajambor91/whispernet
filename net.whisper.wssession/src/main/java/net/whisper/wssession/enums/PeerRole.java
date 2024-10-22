package net.whisper.wssession;

public enum PeerRole {
    INITIATOR("initiator"),
    JOINER("joiner");


    private final String peerRoleName;

    PeerRole(String peerRoleName) {
        this.peerRoleName = peerRoleName;
    }

    public String getPeerRoleName() {
        return peerRoleName;
    }
}