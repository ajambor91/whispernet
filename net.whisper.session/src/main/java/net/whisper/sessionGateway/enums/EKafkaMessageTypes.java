package net.whisper.sessionGateway.enums;

public enum EKafkaMessageTypes {
    NEW_CLIENT("new-client"),
    ADD_CLIENT("add-client"),
    RETURN_SESSION("return-session");
    private final String messageType;

    EKafkaMessageTypes(String messageType) {
        this.messageType = messageType;
    }

    public String getMessageType() {
        return this.messageType;
    }


}
