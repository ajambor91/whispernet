package net.whisper.wssession.clients.enums;

public enum EKafkaMessageClientTypes {
    NEW_CLIENT("new-client"),
    ADD_CLIENT("add-client"),
    UPDATE_CLIENT("update-client"),
    UPDATE_RETURN_CLIENT("update-return-client"),
    RETURN_SESSION("return-session");
    private final String messageType;

    EKafkaMessageClientTypes(String messageType) {
        this.messageType = messageType;
    }

    public String getMessageType() {
        return this.messageType;
    }


}
