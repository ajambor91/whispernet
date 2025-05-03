package net.whisper.session.Session.Enums;

public enum EKafkaMessageSessionTypes {
    ACCEPT_SESSION("accept-Session"),
    REMOVE_SESSION("remove-Session"),
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
