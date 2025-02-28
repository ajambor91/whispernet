import {EventEmitter} from "events";
import {IPeer} from "../models/peer.model";
import WebSocket from "ws";
import {IApprovingMessageWs} from "../models/approving-message-ws.model";
import {Session} from "./session";
import {EWsApprovingMsgType} from "../enums/ws-approving-msg-type.enum";

import {logInfo} from "../logger/looger";

export class Peer extends EventEmitter implements IPeer {
    private _session: Session;

    public constructor(peer: IPeer, session: Session) {
        super();
        this._session = session;
        this._userId = peer.userId;
        this._userToken = peer.userToken;
        this._webSocket = peer.webSocket;
    }

    private _userToken: string;

    public get userToken(): string {
        return this._userToken;
    }

    private _userId: string | undefined;

    public get userId(): string | undefined {
        return this._userId;
    }

    private _webSocket: WebSocket | undefined;

    public get webSocket(): WebSocket | undefined {
        return this._webSocket;
    }

    public receiveMessage(wsMessage: IApprovingMessageWs): void {
        this.emit("action", wsMessage);
        logInfo({message: `Peer ${this.userToken} received message with ${wsMessage.type}`})
    }

    public updatePeer(peer: IPeer): void {


        if (peer.webSocket && !this._webSocket) {
            logInfo({message: `Peer ${peer.userToken}  doesn't  have websocket, adding new`})

            this._webSocket = peer.webSocket;
        }
        if (peer.userId && !this._userId) {
            logInfo({message: `Peer ${peer.userToken}  doesn't  have userId, adding new`})
            this._userId = peer.userId;
        }


        if (!!this._userId && !!this._webSocket) {
            logInfo({message: `Sending message to partner`})

            this.sendConnectMessage();

        }
        this.subscribePartner();
    }

    private sendConnectMessage(): void {
        const message: IApprovingMessageWs = {
            sessionToken: this._session.sessionToken,
            type: EWsApprovingMsgType.CONNECT
        }
        this.sendMessage(this._webSocket as WebSocket, message);
    }

    private subscribePartner(): void {
        this._session.peers.forEach(peer => {
            if (peer.userId !== this._userId) {
                peer.on("action", data => {
                    logInfo({message: `Peer ${this._userToken}, received event from partner ${peer._userToken}`})
                    this.sendMessage(this._webSocket as WebSocket, data)
                });
                this.touchPartner(peer)
            }
        })
    }


    private touchPartner(peer: Peer): void {
        const msg: IApprovingMessageWs = {
            type: EWsApprovingMsgType.TOUCH,
            sessionToken: this._session.sessionToken
        }
        this.sendMessage(peer._webSocket as WebSocket, msg);
    }

    private sendMessage(socket: WebSocket, msg: IApprovingMessageWs): void {
        socket.send(Buffer.from(JSON.stringify(msg)));
    }


}