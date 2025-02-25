package net.whisper.sessionGateway.enums;

public enum EKafkaMessageTypes {
    NEW_CLIENT("new-client"),
    ADD_CLIENT("add-client"),
    UPDATE_CLIENT("update-client"),
    UPDATE_RETURN_CLIENT("update-return-client"),
    RETURN_SESSION("return-session");
    private final String messageType;

    EKafkaMessageTypes(String messageType) {
        this.messageType = messageType;
    }

    public String getMessageType() {
        return this.messageType;
    }


}
