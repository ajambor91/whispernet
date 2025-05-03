package net.whisper.usersession.Enums;

public enum EPeerRole {
    INITIATOR("initiator"),
    JOINER("joiner");


    private final String peerRoleName;

    EPeerRole(String peerRoleName) {
        this.peerRoleName = peerRoleName;
    }

    public static EPeerRole fromValue(String value) {
        for (EPeerRole enumValue : EPeerRole.values()) {
            if (enumValue.getPeerRoleName().equals(value)) {
                return enumValue;
            }
        }
        throw new IllegalArgumentException("Unknown enum value: " + value);
    }

    public String getPeerRoleName() {
        return peerRoleName;
    }
}