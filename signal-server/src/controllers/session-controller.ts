import {IInitialPeer} from "../models/peer.model";
import {Peer} from "../classes/peer";
import {EWebSocketEventType} from "../enums/ws-message.enum";
import {AppEvent} from "../classes/app-event";
import {logError, logInfo, logWarning} from "../error-logger/error-looger";
import {IPeerSession, ISession} from "../models/session.model";
import {PeerRole} from "../enums/peer-role.enum";
import {Session} from "../classes/session";
import {ESessionStatus} from "../enums/session-status.enum";

type PeerState = {
    client: Peer;
    pendingOffer: boolean;
    isInitiator: boolean;
};

export class SessionController extends Session {
    private readonly _maxPeersPerSession: number = 2
    private readonly _clientMap: Map<string, PeerState> = new Map();


    constructor(session: ISession) {
        super();
        this._sessionStatus = session.sessionStatus;
        this._sessionToken = session.sessionToken;
        this._addUser(session.peerClients)
    }

    // private _initSession(session: ISession): void {
    //     this._session = session;
    //     session.peerClients.forEach(peer => {
    //         this.addUser(peer)
    //     })
    // }


    public initializePeerConnection(peer: Peer, appEvent: AppEvent): void {
        try {
            logInfo({ event: "InitializePeerConnection", message: "Initializing peer connection", userToken: peer.userToken });
            peer.initClient(appEvent);
            appEvent.sendDataMessage({
                sessionToken: peer.session.sessionToken,
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
        return Array.from(this._clientMap.values()).map(state => state.client);
    }

    public ifUserExists(userToken: string): boolean {
        const exists = this._clientMap.has(userToken);
        logInfo({ event: "CheckUserExists", message: `Checking if user exists`, userToken, exists });
        return exists;
    }

    public getUsersSkipped(userToken: string): Peer[] {
        const skippedUsers = Array.from(this._clientMap.values())
            .filter(state => state.client.userToken !== userToken)
            .map(state => state.client);
        logInfo({ event: "GetUsersSkipped", message: "Retrieving users excluding specified token", userToken, skippedCount: skippedUsers.length });
        return skippedUsers;
    }

    public getUser(userToken: string): Peer | undefined {
        const user = this._clientMap.get(userToken)?.client;
        logInfo({ event: "GetUser", message: "Retrieving user by token", userToken, found: !!user });
        return user;
    }

    public updateSession(session: ISession) {
        if (this.sessionStatus !== session.sessionStatus) {
            this._sessionStatus = session.sessionStatus;
        }
        this._addUser(session.peerClients)
    }

    public removeUser(userToken: string): void {
        const removed = this._clientMap.delete(userToken);
        logInfo({ event: "RemoveUser", message: "User removed from session", userToken, success: removed });
    }

    public getOppositeUser(userToken: string): Peer | undefined {
        const oppositeUser = Array.from(this._clientMap.values())
            .find(state => state.client.userToken !== userToken)?.client;
        logInfo({ event: "GetOppositeUser", message: "Retrieving opposite user", userToken, found: !!oppositeUser });
        return oppositeUser;
    }

    public setPendingOffer(userToken: string, isPending: boolean): void {
        const peerState = this._clientMap.get(userToken);
        if (peerState) {
            peerState.pendingOffer = isPending;
            logInfo({ event: "SetPendingOffer", message: "Set pending offer status", userToken, isPending });
        } else {
            logWarning({ event: "SetPendingOfferWarning", message: "User not found to set pending offer", userToken });
        }
    }

    public isPendingOffer(userToken: string): boolean {
        const peerState = this._clientMap.get(userToken);
        const isPending = peerState ? peerState.pendingOffer : false;
        logInfo({ event: "IsPendingOffer", message: "Checking if user has pending offer", userToken, isPending });
        return isPending;
    }

    public setInitiator(userToken: string): void {
        this._clientMap.forEach((state, token) => {
            state.isInitiator = (token === userToken);
            logInfo({ event: "SetInitiator", message: "Setting initiator", userToken: token, isInitiator: state.isInitiator });
        });
    }

    public isInitiator(userToken: string): boolean {
        const peerState = this._clientMap.get(userToken);
        const isInitiator = peerState ? peerState.isInitiator : false;
        logInfo({ event: "IsInitiator", message: "Checking if user is initiator", userToken, isInitiator });
        return isInitiator;
    }

    public endSession(): void {
        logInfo({ event: "EndSession", message: "Ending session and clearing all users" });
        this._clientMap.clear();
    }

    private _addUser(peers: IInitialPeer[]): void {
        peers.forEach(peer => {
            if (!this._clientMap.has(peer.userToken) && Object.entries(this._clientMap).length <= this._maxPeersPerSession) {
                const isInitiator: boolean = peer.peerRole === PeerRole.Initiator
                const session: IPeerSession = {
                    sessionStatus: this._sessionStatus as ESessionStatus,
                    sessionToken: this._sessionToken as string
                }
                const client = new Peer(peer, session);
                this._clientMap.set(peer.userToken, {
                    client,
                    pendingOffer: false,
                    isInitiator
                });
                logInfo({ event: "AddUser", message: "User added to session", userToken: peer.userToken, isInitiator });
            } else {
                const errorMessage = `Client with token ${peer.userToken} already exists`;
                logWarning({ event: "AddUserWarning", message: errorMessage });
            }
        });
    }
}
