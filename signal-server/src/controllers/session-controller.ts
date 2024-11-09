import { IClient, IInitialClient } from "../models/client.model";
import { Peer } from "../classes/peer";
import { EWebSocketEventType } from "../enums/ws-message.enum";
import { AppEvent } from "../classes/base-event.class";
import { logWarning, logError, logInfo } from "../error-logger/error-looger";
import {ISession} from "../models/session.model";

type PeerState = {
    client: Peer;
    pendingOffer: boolean;
    isInitiator: boolean;
};

export class SessionController {
    private clientMap: Map<string, PeerState> = new Map();
    private _session: ISession;

    constructor(session: ISession) {
        this._session = session;
    }

    public get session(): ISession {
        return this._session;
    }
    public initializePeerConnection(peer: Peer, appEvent: AppEvent): void {
        try {
            logInfo({ event: "InitializePeerConnection", message: "Initializing peer connection", userToken: peer.userToken });
            peer.initClient(appEvent);
            appEvent.sendDataMessage({
                session: peer.session,
                type: EWebSocketEventType.Connect
            });
            const existingClients: Peer[] = this.getUsersSkipped(peer.userToken) as Peer[];
            peer.addPartner(existingClients);
            existingClients.forEach(existingClient => {
                existingClient.addPartner(peer);
            });
        } catch (e) {
            logError({ event: "InitializePeerConnectionError", message: "Error initializing peer connection", error: e });
        }
    }

    public closePeerConnection(peer: Peer, appEvent: AppEvent): void {
        try {
            logInfo({ event: "InitializePeerConnection", message: "Initializing peer connection", userToken: peer.userToken });
            appEvent.close();
            peer.initClient(appEvent);

            const existingClients: Peer[] = this.getUsersSkipped(peer.userToken) as Peer[];
            peer.addPartner(existingClients);
            existingClients.forEach(existingClient => {
                existingClient.addPartner(peer);
            });
        } catch (e) {
            logError({ event: "InitializePeerConnectionError", message: "Error initializing peer connection", error: e });
        }
    }

    public getUsers(): Peer[] {
        logInfo({ event: "GetUsers", message: "Retrieving all users in session" });
        return Array.from(this.clientMap.values()).map(state => state.client);
    }

    public ifUserExists(userToken: string): boolean {
        const exists = this.clientMap.has(userToken);
        logInfo({ event: "CheckUserExists", message: `Checking if user exists`, userToken, exists });
        return exists;
    }

    public getUsersSkipped(userToken: string): Peer[] {
        const skippedUsers = Array.from(this.clientMap.values())
            .filter(state => state.client.userToken !== userToken)
            .map(state => state.client);
        logInfo({ event: "GetUsersSkipped", message: "Retrieving users excluding specified token", userToken, skippedCount: skippedUsers.length });
        return skippedUsers;
    }

    public getUser(userToken: string): Peer | undefined {
        const user = this.clientMap.get(userToken)?.client;
        logInfo({ event: "GetUser", message: "Retrieving user by token", userToken, found: !!user });
        return user;
    }

    public addUser(peer: IInitialClient, isInitiator: boolean = false): void {
        if (!this.clientMap.has(peer.userToken)) {
            const client = new Peer(peer);
            this.clientMap.set(peer.userToken, {
                client,
                pendingOffer: false,
                isInitiator
            });
            logInfo({ event: "AddUser", message: "User added to session", userToken: peer.userToken, isInitiator });
        } else {
            const errorMessage = `Client with token ${peer.userToken} already exists`;
            logWarning({ event: "AddUserWarning", message: errorMessage });
            throw new Error(errorMessage);
        }
    }

    public removeUser(userToken: string): void {
        const removed = this.clientMap.delete(userToken);
        logInfo({ event: "RemoveUser", message: "User removed from session", userToken, success: removed });
    }

    public getOppositeUser(userToken: string): Peer | undefined {
        const oppositeUser = Array.from(this.clientMap.values())
            .find(state => state.client.userToken !== userToken)?.client;
        logInfo({ event: "GetOppositeUser", message: "Retrieving opposite user", userToken, found: !!oppositeUser });
        return oppositeUser;
    }

    public setPendingOffer(userToken: string, isPending: boolean): void {
        const peerState = this.clientMap.get(userToken);
        if (peerState) {
            peerState.pendingOffer = isPending;
            logInfo({ event: "SetPendingOffer", message: "Set pending offer status", userToken, isPending });
        } else {
            logWarning({ event: "SetPendingOfferWarning", message: "User not found to set pending offer", userToken });
        }
    }

    public isPendingOffer(userToken: string): boolean {
        const peerState = this.clientMap.get(userToken);
        const isPending = peerState ? peerState.pendingOffer : false;
        logInfo({ event: "IsPendingOffer", message: "Checking if user has pending offer", userToken, isPending });
        return isPending;
    }

    public setInitiator(userToken: string): void {
        this.clientMap.forEach((state, token) => {
            state.isInitiator = (token === userToken);
            logInfo({ event: "SetInitiator", message: "Setting initiator", userToken: token, isInitiator: state.isInitiator });
        });
    }

    public isInitiator(userToken: string): boolean {
        const peerState = this.clientMap.get(userToken);
        const isInitiator = peerState ? peerState.isInitiator : false;
        logInfo({ event: "IsInitiator", message: "Checking if user is initiator", userToken, isInitiator });
        return isInitiator;
    }

    public endSession(): void {
        logInfo({ event: "EndSession", message: "Ending session and clearing all users" });
        this.clientMap.clear();
    }
}
