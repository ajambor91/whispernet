import {Consumer, EachMessagePayload, Kafka, KafkaConfig, PartitionAssigners, Producer} from "kafkajs";
import {Orchestrator} from "./orchestrator";
import {logInfo} from "../logger/looger";

const kafkaConfig: KafkaConfig = {
    clientId: 'consumer-responder-verification',
    brokers: ['broker:9092'],
    retry: {initialRetryTime: 300, retries: 10},
    connectionTimeout: 3000,
};

export class KafkaResponder {
    private static instance: KafkaResponder;
    private readonly _orchestrator: Orchestrator;
    private readonly _kafka: Kafka = new Kafka(kafkaConfig);
    private readonly _consumer: Consumer = this._kafka.consumer({
        groupId: 'whispernet-node-approving-group',
        partitionAssigners: [PartitionAssigners.roundRobin]
    });
    private readonly _producer: Producer = this._kafka.producer();
    private readonly kafkaTopic: string = "request-approving";

    private constructor(orchestrator: Orchestrator) {
        this._orchestrator = orchestrator;
        this.initialize();
        logInfo({message: "Initialized Kafka"})
    }

    public static getInstance(orchestrator: Orchestrator) {
        if (!KafkaResponder.instance) {
            KafkaResponder.instance = new KafkaResponder(orchestrator);
        }
        return KafkaResponder.instance;
    }

    private initialize(): void {
        this.startConsume();
        this.startListening();
    }

    private async startConsume(): Promise<void> {
        await this._consumer.subscribe({topic: this.kafkaTopic, fromBeginning: true});
    }

    private async startListening(): Promise<void> {
        await this._consumer.run({
            eachMessage: async ({topic, partition, message}: EachMessagePayload) => {
                logInfo({message: "Received kafka message" + message.value?.toString()})

                if (message.value && typeof message.value.toString() === 'string') {
                    this._orchestrator.setIncomingSession(message.value.toString() as string);

                }
            }
        })
    }
}