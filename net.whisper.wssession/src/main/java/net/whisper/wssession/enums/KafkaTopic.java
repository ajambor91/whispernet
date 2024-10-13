package net.whisper.wssession;

public enum KafkaTopic {
    USER_TOKEN_TOPIC("request-user-token-topic"),
    USER_TOKEN_EXISTS_WSESSION_TOPIC("request-user-token-exists-wsession-topic");

    private final String topicName;

    KafkaTopic(String topicName) {
        this.topicName = topicName;
    }

    public String getTopicName() {
        return topicName;
    }
}
