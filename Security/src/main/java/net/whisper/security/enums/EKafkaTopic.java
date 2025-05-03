package net.whisper.security.enums;

public enum EKafkaTopic {
    CHECK_SIGN_CLIENT("request-check-return-signed-client-topic"),
    CHECK_SIGN_PARTNER("request-signed-partner-topic");
    private final String topicName;

    EKafkaTopic(String topicName) {
        this.topicName = topicName;
    }

    public String getTopicName() {
        return topicName;
    }
}
