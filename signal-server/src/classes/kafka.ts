import {Consumer, EachMessagePayload, Kafka, KafkaConfig, PartitionAssigners, Producer} from "kafkajs";
import {getSessionManager, SessionManager} from "../managers/session-manager";
import {SessionController} from "../controllers/session-controller";
import {logError, logInfo} from "../error-logger/error-looger";
import {IKafkaMessage} from "../models/kafka-message.model";
import {ISession} from "../models/session.model";
import {IHeaders} from "../managers/headers.model";
import {EKafkaMessageTypes} from "../enums/kafka-message-types.enum";

const kafkaConfig: KafkaConfig = {
    clientId: 'consumer-wsserver',
    brokers: ['broker:9092'],
    retry: { initialRetryTime: 300, retries: 10 },
    connectionTimeout: 3000,
};

class KafkaWS {
    private _headers: IHeaders | undefined = undefined;
    private static _instance: KafkaWS;
    private _isInitialized = false;
    private readonly _sessionTopic = 'request-websocket-session-topic';
    // private readonly _sessionUpdateTopic: string = 'request-session-update-topic'
    // private readonly _sessionRemoveTopic = 'request-session-remove-topic';
    private readonly _kafka: Kafka = new Kafka(kafkaConfig);
    private readonly _consumer: Consumer = this._kafka.consumer({ groupId: 'whispernet-node-group', partitionAssigners: [PartitionAssigners.roundRobin] });
    private readonly _producer: Producer = this._kafka.producer();

    private constructor() {
        this.initialize();
    }

    public static getInstance(): KafkaWS {
        if (!this._instance) this._instance = new KafkaWS();
        return this._instance;
    }

    private async initialize(): Promise<void> {
        try {
            await Promise.all([this._consumer.connect(), this._producer.connect()]);
            this._isInitialized = true;
            this._initListening();
        } catch (error) {
            logError({ event: 'Kafka:initialize', message: error });
        }
    }

    public async sendMessage(message: IKafkaMessage): Promise<void> {
        if (!this._isInitialized) {
            logError({ event: 'Kafka:sendMessage', message: 'Producer not initialized yet' });
            return;
        }
        try {
            await this._producer.send({
                topic: this._sessionTopic,
                messages: [{ value: JSON.stringify(message) }]
            });
            logInfo({ event: 'Kafka:sendMessage', message: 'Message sent successfully' });
        } catch (error) {
            logError({ event: 'Kafka:sendMessage', message: error });
        }
    }

    private async _initListening(): Promise<void> {
        await Promise.all([
            this._consumer.subscribe({ topic: this._sessionTopic, fromBeginning: true }),
            this._consumer.subscribe({ topic: this._sessionTopic, fromBeginning: true })
        ]);
        await this._run();

    }

    private async _run(): Promise<void> {
        await this._consumer.run({
            eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                if (message.headers) {
                    let headers: IHeaders = {};

                    for (const [key, value] of Object.entries(message.headers)) {
                        if (Buffer.isBuffer(value) &&   this._isHeader(key)) {
                            headers.type = value.toString('utf-8');
                        }
                    }
                    this._headers = headers;
                }

                if (message.value instanceof Buffer) {
                    const stringMessage:  string = message.value.toString();
                    try {
                        switch (this._headers?.type) {
                            case EKafkaMessageTypes.NEW_SESSION:
                                this._createSession(stringMessage);
                                break;
                            case EKafkaMessageTypes.ADD_CLIENT_TO_SESSION:
                                this._updateSession(stringMessage);

                        }

                    } catch (error) {
                        logError({ event: 'Kafka:initListening', message: error });
                    }
                }
            }
        });
    }

    private _isHeader(header: string) {
        return header === 'type';
    }

    private _createSession(message: string): void {
        const session: ISession = JSON.parse(JSON.parse(message));
        if (!session || !session.sessionToken) {
            throw new Error('Invalid session')
        }
        logInfo({ event: 'Kafka:initListening', data: 'Get session data', sessionToken: session.sessionToken});
        const sessionManager: SessionManager = getSessionManager;
        const isSessionExists = sessionManager.hasSession(session.sessionToken);
        if (isSessionExists) {
            throw new Error("Session exists");
        }
        const newSession: SessionController = new SessionController(session);
        sessionManager.addSession(session.sessionToken, newSession);
        logInfo({ event: 'Kafka:initListening', data: 'Get session data', sessionToken: session.sessionToken });

    }

    private _updateSession(message: string): void {
        const incommingSession: ISession = JSON.parse(JSON.parse(message));
        if (!incommingSession || !incommingSession.sessionToken) {
            throw new Error('Invalid session')
        }
        logInfo({ event: 'Kafka:initListening', data: 'Get session data', sessionToken: incommingSession.sessionToken});
        const sessionManager: SessionManager = getSessionManager;
        const session = sessionManager.getSession(incommingSession.sessionToken);
        if (!session) {
            throw new Error("Session not exists");
        }
        session.updateSession(incommingSession)
        logInfo({ event: 'Kafka:initListening', data: 'Get session data', sessionToken: incommingSession.sessionToken });
    }
}

export const startKafka = () => KafkaWS.getInstance();
export const sendKafkaMessage = (message: IKafkaMessage) => KafkaWS.getInstance().sendMessage(message);