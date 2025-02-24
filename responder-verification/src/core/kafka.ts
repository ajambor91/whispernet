import {KafkaConfig} from "kafkajs";

const kafkaConfig: KafkaConfig = {
    clientId: 'consumer-responder-verification',
    brokers: ['broker:9092'],
    retry: { initialRetryTime: 300, retries: 10 },
    connectionTimeout: 3000,
};

class Kafka {

}