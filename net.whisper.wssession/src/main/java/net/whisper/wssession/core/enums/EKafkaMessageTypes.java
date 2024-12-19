package net.whisper.wssession.core.enums;

public enum EKafkaMessageTypes {
    NEW_SESSION("new-session"),
    ADD_CLIENT_TO_SESSION("add-client-to-session"),
    RETURN_SESSION("return-session");
    private final String messageType;

    EKafkaMessageTypes(String messageType) {
        this.messageType = messageType;
    }

    public String getMessageType() {
        return this.messageType;
    }


}
