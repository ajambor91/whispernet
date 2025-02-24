package net.whisper.sessionGateway.enums;

public enum EKafkaTopic {
    CLIENT_TOPIC("request-client-topic"),
    RETURN_CLIENT_TOPIC("request-return-client-topic"),
    SESSION_TOPIC("request-initialization-topic"),
    WEBSOCKET_SESSION_TOPIC("request-websocket-session-topic"),
    CHECK_PARTNER("request-check-partner"),
    CHECK_SIGNED_CLIENT_TOPIC("request-signed-client-topic"),
    VERIFICATION_REQUEST("verification-request");
    private final String topicName;

    EKafkaTopic(String topicName) {
        this.topicName = topicName;
    }

    public String getTopicName() {
        return topicName;
    }
}
