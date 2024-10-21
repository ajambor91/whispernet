package net.whisper.wssession;

public enum KafkaTopic {
    CLIENT_TOPIC("request-client-topic"),
    CLIENT_JOINING_TOPIC("request-joining-client-topic");

    private final String topicName;

    KafkaTopic(String topicName) {
        this.topicName = topicName;
    }

    public String getTopicName() {
        return topicName;
    }
}
