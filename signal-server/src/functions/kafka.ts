import {EachMessagePayload, Kafka, KafkaConfig, PartitionAssigners} from "kafkajs";

import * as console from "console";
import {getSessionManager, SessionManager} from "../managers/session-manager";
import { IInitialClient} from "../models/client.model";
import { SessionController} from "../controllers/session-controller";
import {logError, logInfo} from "../error-logger/error-looger";


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
                    console.error('Invalid user')
                    logError({data: 'Invalid user'});
                    return;
                }}
                logInfo({data: 'Get session data'})
                let currentSession: SessionController | undefined = sessionManager.getSession(client.session.sessionToken);
                if (!currentSession) {
                    currentSession = new SessionController(client.session);
                    sessionManager.addSession(client.session.sessionToken, currentSession)
                    logInfo({data: 'New session created'})
                }
                currentSession.addUser(client);

            }

        }
    })
}