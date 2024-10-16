import {EachMessagePayload, Kafka, KafkaConfig, PartitionAssigners} from "kafkajs";
import {Session} from "../models/session.model";
import {clientsMap} from "../mappers/clients.map";
import * as console from "console";


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
    await consumer.subscribe({topic: 'request-ws-startws-topic', fromBeginning: true});
    await consumer.run({
        eachMessage: async ({topic, partition, message}: EachMessagePayload) => {
            console.log('message kafka',message.value)
            if (message.value instanceof Buffer) {
                const sessionToken: string = message.value.toString();
                const sessiontTokensObj: Session = JSON.parse(JSON.parse(sessionToken));

                clientsMap.setClient(sessiontTokensObj.wsSessionToken, sessiontTokensObj.usersTokens);
                console.log(clientsMap.getClient(sessiontTokensObj.wsSessionToken));
            }

        }
    })
}