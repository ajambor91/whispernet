package net.whisper.wssession.session.enums;

public enum EKafkaMessageSessionTypes {
    CREATE_SESSION("create-session"),
    REMOVE_SESSION("remove-session"),
    ADD_USER("add-user"),
    REMOVE_USER("remove-user"),
    UPDATE_STATUS("update-status");

    private final String messageType;

    EKafkaMessageSessionTypes(String messageType) {
        this.messageType = messageType;
    }

    public String getMessageType() {
        return this.messageType;
    }


}
