import {ISession} from "../models/session.model";
import {IPeer} from "../models/peer.model";
import {Peer} from "./peer";

export class Session implements ISession {
    private readonly _sessionToken: string;
    private readonly _peers: Peer[];

    public constructor(data: ISession) {
        this._sessionToken = data.sessionToken;
        this._peers = this.createPeers(data.peers);
    }

    public get sessionToken(): string {
        return this._sessionToken;
    }

    public get peers(): IPeer[] {
        return this._peers;
    }

    public updatePeers(data: ISession): void {
        for (let i = 0; i < data.peers.length; i++) {
            if (this._peers.some(existingPeer => existingPeer.userId === data.peers[i].userId)) {

                continue;
            }
            this._peers.push(new Peer(data.peers[i]));
        }
    }

    private createPeers(peers: IPeer[]): Peer[] {
        return peers.map(peer => new Peer(peer));
    }
}