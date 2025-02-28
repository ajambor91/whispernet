package net.whisper.wssession.session.enums;

public enum EKafkaMessageSessionTypes {
    ACCEPT_SESSION("accept-session"),
    REMOVE_SESSION("remove-session"),
    REMOVE_USER("remove-user"),
    DISCONNECT_USER("disconnect-user");

    private final String messageType;

    EKafkaMessageSessionTypes(String messageType) {
        this.messageType = messageType;
    }

    public String getMessageType() {
        return this.messageType;
    }


}
