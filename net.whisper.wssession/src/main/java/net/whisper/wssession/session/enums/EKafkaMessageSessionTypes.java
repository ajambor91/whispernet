package net.whisper.wssession.session.enums;

public enum EKafkaMessageSessionTypes {
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
