import {EachMessagePayload, Kafka, KafkaConfig, PartitionAssigners} from "kafkajs";

import * as console from "console";
import {Client} from "../models/client.model";
import {createSessionManager, SessionManager, sessionMap} from "./session-manager";


const kafkaConfig: KafkaConfig = {
    clientId: 'consumer-wsserver',
    brokers: ['broker:9092'],
    retry: {
        initialRetryTime: 300,
        retries: 10
    },
    connectionTimeout: 3000
};
export async function startKafka() {
    const kafka: Kafka = new Kafka(kafkaConfig)
    const consumer = kafka.consumer({groupId: 'whispernet-node-group',  partitionAssigners: [PartitionAssigners.roundRobin]});
    await consumer.connect();
    await consumer.subscribe({topic: 'request-init-ws-session-topic', fromBeginning: true});
    await consumer.run({
        eachMessage: async ({topic, partition, message}: EachMessagePayload) => {
            if (message.value instanceof Buffer) {
                let sessionManager: SessionManager | undefined;
                const clientMsg: string = message.value.toString();
                const client: Client = JSON.parse(JSON.parse(clientMsg));
                sessionManager = sessionMap.get(client.session.sessionToken)
                if (!sessionManager) {
                    sessionManager = createSessionManager();
                    sessionMap.set(client.session.sessionToken, sessionManager);
                }

                sessionManager.addClient(client);
            }

        }
    })
}