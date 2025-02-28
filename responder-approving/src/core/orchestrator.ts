import {KafkaResponder} from "./kafka";
import {Socket} from "./socket";
import {sessionManager, SessionManager} from "./session.manager";
import {ISession} from "../models/session.model";
import {Session} from "./session";
import WebSocket from 'ws';
import {IncomingMessage} from "http";
import {IIncomingPeer} from "./incoming-peer.model";
import {logError, logInfo} from "../logger/looger";
import {getCookie, parseMessage} from "../helpers/functions";
import {IApprovingMessageWs} from "../models/approving-message-ws.model";
import {EWsApprovingMsgType} from "../enums/ws-approving-msg-type.enum";
import {EKafkaMessageTypes} from "../enums/kafka-message-types.enum";
import {IKafkaMessage} from "../models/kafka-message.model";

export class Orchestrator {
    private readonly _kafka: KafkaResponder;
    private readonly _socket: Socket;
    private readonly _sessionManager: SessionManager;

    public constructor(port: number) {
        this._kafka = KafkaResponder.getInstance(this);
        this._socket = Socket.getInstance(port, this);
        this._sessionManager = sessionManager;

    }

    public setIncomingSession(incomingPeerString: string) {
        const incomingPeer: IIncomingPeer = JSON.parse(incomingPeerString);
        this.updateOrCreateSession(incomingPeer);

    }

    public notifyKafka(session: IKafkaMessage, type: EKafkaMessageTypes): void {

        this._kafka.sendKafkaMessage(session, type);
    }

    public setSocketToExistingPeer(socket: WebSocket, message: IncomingMessage): void {
        const userToken: string = getCookie(message);

        socket.on("message", (msg: Buffer) => {
            const wsMessage: IApprovingMessageWs = parseMessage(msg);
            logInfo({message: "New WebSocket message: " + JSON.stringify(wsMessage)})

            const peer: IIncomingPeer = {
                sessionToken: wsMessage.sessionToken,
                userToken: userToken,
                ws: socket,

            }
            if (wsMessage.type === EWsApprovingMsgType.AUTH) {
                this.updateOrCreateSession(peer);
            } else {
                this.passMessage(userToken, wsMessage);
            }
        })
    }

    private passMessage(userToken: string, approvingMessageWs: IApprovingMessageWs): void {
        const session: ISession = this.createSession({
            sessionToken: approvingMessageWs.sessionToken,
            userToken: userToken
        });
        if (!session.sessionToken) {
            logError({message: "No session token found"})
            return
        }
        let sessionStored: Session | null = this._sessionManager.getSession(session);
        if (!sessionStored) {
            logError({message: "No session in store"})
            return

        }
        sessionStored.passMessage(userToken, approvingMessageWs);
    }

    private updateOrCreateSession(peer: IIncomingPeer): void {
        const session: ISession = this.createSession(peer);
        if (!session.sessionToken) {
            logError({message: "No session token found"})
            return
        }

        let sessionStored: Session | null = this._sessionManager.getSession(session);
        if (!sessionStored) {
            logInfo({message: `Session doesn't exist, creating new one ${session.sessionToken}`})

            this._sessionManager.addSession(session, this)

        } else {
            logInfo({message: `Session exists, updating ${session.sessionToken}`})

            sessionStored.updatePeers(session);
        }
    }

    private createSession(peer: IIncomingPeer): ISession {
        return {
            sessionToken: peer.sessionToken,
            peers: [
                {
                    webSocket: peer.ws,
                    userId: peer.userId,
                    userToken: peer.userToken
                }
            ]
        }
    }
}