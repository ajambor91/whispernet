import {KafkaResponder} from "./kafka";
import {Socket} from "./socket";
import {sessionManager, SessionManager} from "./session.manager";
import {ISession} from "../models/session.model";
import {Session} from "./session";
import WebSocket from 'ws';
import {IncomingMessage} from "http";
import {IIncomingPeer} from "./incoming-peer.model";
import {logInfo} from "../logger/looger";

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
        const session: ISession = {
            sessionToken: incomingPeer.sessionToken,
            peers: [
                {
                    userId: incomingPeer.userId,
                    userToken: incomingPeer.userToken
                }
            ]
        }
        if (!session.sessionToken) {
            throw new Error("No session found");
        }

        let sessionStored: Session | null = this._sessionManager.getSession(session);
        if (!sessionStored) {
            this._sessionManager.addSession(session)

        } else {
            sessionStored.updatePeers(session);
        }

    }

    public setSocketToExistingPeer(socket: WebSocket, message: IncomingMessage): void {
        socket.on("message", (msg) => {
            logInfo({message: "New WebSocket message: "})
        })
    }

}