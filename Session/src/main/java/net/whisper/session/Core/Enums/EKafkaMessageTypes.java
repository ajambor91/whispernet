package net.whisper.session.Core.Enums;

public enum EKafkaMessageTypes {
    NEW_SESSION("new-Session"),
    ADD_CLIENT_TO_SESSION("add-client-to-Session"),
    RETURN_SESSION("return-Session"),
    UPDATE_CLIENT("update-client"),
    UPDATE_LOGIN_CLIENT("update-login-client");
    private final String messageType;

    EKafkaMessageTypes(String messageType) {
        this.messageType = messageType;
    }

    public String getMessageType() {
        return this.messageType;
    }


}
