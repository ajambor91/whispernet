import {EachMessagePayload, Kafka, KafkaConfig, PartitionAssigners} from "kafkajs";

import * as console from "console";
import {getSessionManager, SessionManager} from "../managers/session-manager";
import { IInitialClient} from "../models/client.model";
import { SessionController} from "../managers/user-manager";


const kafkaConfig: KafkaConfig = {
    clientId: 'consumer-wsserver',
    brokers: ['broker:9092'],
    retry: {
        initialRetryTime: 300,
        retries: 10
    },
    connectionTimeout: 3000,
};
export async function startKafka() {
    const kafka: Kafka = new Kafka(kafkaConfig)
    const consumer = kafka.consumer({groupId: 'whispernet-node-group',  partitionAssigners: [PartitionAssigners.roundRobin]});
    await consumer.connect();
    await consumer.subscribe({topic: 'request-init-ws-session-topic', fromBeginning: true});
    await consumer.run({
        eachMessage: async ({topic, partition, message}: EachMessagePayload) => {
            if (message.value instanceof Buffer) {
                let sessionManager: SessionManager = getSessionManager;
                const clientMsg: string = message.value.toString();
                const client: IInitialClient = JSON.parse(JSON.parse(clientMsg));
                if (!client || !client.userToken) {{
                    throw new Error('Invalid user')
                }}
                console.log("SESSION")
                let currentSession: SessionController | undefined = sessionManager.getSession(client.session.sessionToken);
                if (!currentSession) {
                    currentSession = new SessionController();
                    sessionManager.addSession(client.session.sessionToken, currentSession)
                }
                currentSession.addUser(client);

            }

        }
    })
}