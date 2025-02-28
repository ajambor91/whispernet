import {ISession} from "../models/session.model";
import {IPeer} from "../models/peer.model";
import {Peer} from "./peer";
import {IApprovingMessageWs} from "../models/approving-message-ws.model";
import {EWsApprovingMsgType} from "../enums/ws-approving-msg-type.enum";
import {Orchestrator} from "./orchestrator";
import {EKafkaMessageTypes} from "../enums/kafka-message-types.enum";
import {logInfo} from "../logger/looger";

export class Session implements ISession {
    private readonly _orchestrator: Orchestrator;
    private readonly _sessionToken: string;
    private readonly _peers: Peer[];
    private _votes: number = 0;
    private _accepts: number = 0;

    public constructor(data: ISession, orchestrator: Orchestrator) {
        this._sessionToken = data.sessionToken;
        this._orchestrator = orchestrator;
        this._peers = this.createPeers(data.peers);
    }

    public get sessionToken(): string {
        return this._sessionToken;
    }

    public get peers(): Peer[] {
        return this._peers;
    }

    public passMessage(userToken: string, wsMessage: IApprovingMessageWs): void {
        const foundPeer: Peer | undefined = this._peers.find(existing => existing.userToken === userToken);
        if (foundPeer) {
            if (wsMessage.type === EWsApprovingMsgType.DECLINE) {
                this._votes++;
                this._accepts--;
                logInfo({message: `Peer ${foundPeer.userToken} declined, in session ${this._sessionToken}, updating`})

            } else if (wsMessage.type === EWsApprovingMsgType.ACCEPT) {
                this._votes++
                this._accepts++
                logInfo({message: `Peer ${foundPeer.userToken} accept, in session ${this._sessionToken}, updating`})

            }
            foundPeer.receiveMessage(wsMessage);

            if (this._votes === this._peers.length) {
                logInfo({message: `Send message to kafka`})

                this.notifyPeers(this._votes === this._accepts ? EWsApprovingMsgType.SESSION_ACCEPTED : EWsApprovingMsgType.SESSION_DECLINED)
            }
        }
    }

    public updatePeers(data: ISession): void {
        for (let i = 0; i < data.peers.length; i++) {
            const currentPeer: IPeer = data.peers[i];
            const foundPeer: Peer | undefined = this._peers.find(existingPeer =>
                (!!existingPeer.userId && !!currentPeer.userId && existingPeer.userId === currentPeer.userId) ||
                (!!existingPeer.userToken && !!currentPeer.userToken && existingPeer.userToken === currentPeer.userToken));
            if (!!foundPeer) {
                logInfo({message: `Found peer ${foundPeer.userToken} in session ${this._sessionToken}, updating`})
                foundPeer.updatePeer(currentPeer);
                continue;
            }
            logInfo({message: `Peer not found, adding new ${currentPeer.userToken} in session ${this._sessionToken}`})

            this._peers.push(new Peer(currentPeer, this));
        }
    }

    private notifyPeers(type: EWsApprovingMsgType): void {
        this._orchestrator.notifyKafka({sessionToken: this._sessionToken}, type === EWsApprovingMsgType.SESSION_ACCEPTED ? EKafkaMessageTypes.ACCEPT_SESSION : EKafkaMessageTypes.REMOVE_SESSION);
        const msg: IApprovingMessageWs = {
            type,
            sessionToken: this._sessionToken
        }
        this._peers.forEach(peer => {
            peer.webSocket?.send(Buffer.from(JSON.stringify(msg)));
            peer.webSocket?.close();
        })
    }

    private createPeers(peers: IPeer[]): Peer[] {
        return peers.map(peer => new Peer(peer, this));
    }
}