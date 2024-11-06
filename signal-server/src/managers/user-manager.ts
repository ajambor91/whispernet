import { IClient, IInitialClient } from "../models/client.model";
import {Peer} from "../classes/peer";
import {EWebSocketEventType} from "../enums/ws-message.enum";
import {AppEvent} from "../classes/base-event.class";

type PeerState = {
    client: Peer;
    pendingOffer: boolean;
    isInitiator: boolean;
};

export class SessionController {
    private clientMap: Map<string, PeerState> = new Map();

    public initializePeerConnection(peer: Peer, appEvent: AppEvent): void {
        try {
            peer.initClient(appEvent);
            appEvent.sendDataMessage({
                session: peer.session,
                type: EWebSocketEventType.Connect
            })
            const existingClients: Peer[] = this.getUsersSkipped(peer.userToken) as Peer[];
            peer.addPartner(existingClients);
            existingClients.forEach(existingClient => {
                existingClient.addPartner(peer);
            });

        } catch (e) {
            console.error(e)
        }

    }
    public getUsers(): Peer[] {
        return Array.from(this.clientMap.values()).map(state => state.client);
    }

    public ifUserExists(userToken: string): boolean {
        return this.clientMap.has(userToken);
    }

    public getUsersSkipped(userToken: string): Peer[] {
        return Array.from(this.clientMap.values())
            .filter(state => state.client.userToken !== userToken)
            .map(state => state.client);
    }

    public getUser(userToken: string): Peer | undefined {
        return this.clientMap.get(userToken)?.client;
    }

    public addUser(peer: IInitialClient, isInitiator: boolean = false): void {
        if (!this.clientMap.has(peer.userToken)) {
            const client = new Peer(peer);
            this.clientMap.set(peer.userToken, {
                client,
                pendingOffer: false,
                isInitiator
            });
        } else {
            throw new Error('Client already exists');
        }
    }

    public removeUser(userToken: string): void {
        this.clientMap.delete(userToken);
    }

    public getOppositeUser(userToken: string): Peer | undefined {
        return Array.from(this.clientMap.values())
            .find(state => state.client.userToken !== userToken)?.client;
    }

    public setPendingOffer(userToken: string, isPending: boolean): void {
        const peerState = this.clientMap.get(userToken);
        if (peerState) {
            peerState.pendingOffer = isPending;
        }
    }

    public isPendingOffer(userToken: string): boolean {
        const peerState = this.clientMap.get(userToken);
        return peerState ? peerState.pendingOffer : false;
    }

    public setInitiator(userToken: string): void {
        this.clientMap.forEach((state, token) => {
            state.isInitiator = (token === userToken);
        });
    }

    public isInitiator(userToken: string): boolean {
        const peerState = this.clientMap.get(userToken);
        return peerState ? peerState.isInitiator : false;
    }

    public endSession(): void {
        this.clientMap.clear();
    }
}
