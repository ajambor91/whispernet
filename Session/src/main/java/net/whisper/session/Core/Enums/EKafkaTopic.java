package net.whisper.session.Core.Enums;

public enum EKafkaTopic {
    CLIENT_TOPIC("request-client-topic"),
    CLIENT_RESPONSE_TOPIC("request-client-response-topic"),
    RETURN_CLIENT_TOPIC("request-return-client-topic"),
    WEBSOCKET_SESSION_UPDATE_TOPIC("request-Session-update-topic"),
    WEBSOCKET_SESSION_TOPIC("request-websocket-Session-topic");
    private final String topicName;

    EKafkaTopic(String topicName) {
        this.topicName = topicName;
    }

    public String getTopicName() {
        return topicName;
    }
}
