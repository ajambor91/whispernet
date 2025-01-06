import {IInitialPeer, IPeer} from "../models/peer.model";
import { PeerRole } from "../enums/peer-role.enum";
import {IPeerSession} from "../models/session.model";
import { EClientConnectionStatus } from "../enums/client-connection-status.enum";
import { EClientStatus } from "../enums/client-status.enum";
import { AppEvent } from "./app-event";

import { PeerEmitter } from "./peer-emitter.abstract";
import { logInfo } from "../error-logger/error-looger";


export class Peer extends PeerEmitter implements IPeer{

    private _peerRole: PeerRole;
    private _session: IPeerSession;
    private _status: EClientStatus;
    private _userId: string;
    private _userToken: string;
    private _pingInterval: NodeJS.Timeout | null = null;
    private _disconnectTimeout: NodeJS.Timeout | null = null;
    private _conn: AppEvent | undefined;
    private _connectionStatus: EClientConnectionStatus = EClientConnectionStatus.NotConnected;
    private _peerPartners: Peer[] = []
    public get userId(): string {
        return this._userId;
    }

    public get status(): EClientStatus {
        return this._status;
    }

    public get userToken(): string {
        return this._userToken;
    }

    public get session(): IPeerSession {
        return this._session;
    }

    public get conn(): AppEvent {
        if (!this._conn) {
            throw new Error('No connection found');
        }
        return this._conn;
    }

    public addParmter(peer: Peer): void {
        this._peerPartners.push(peer)
    }

    public hasPartner(peer: Peer): boolean {
        return this._peerPartners.some(partner => peer.userToken === partner.userToken);
    }

    public get peerRole(): PeerRole {
        return this._peerRole;
    }

    public get connectionStatus(): EClientConnectionStatus {
        return this._connectionStatus;
    }

    public set connectionStatus(status: EClientConnectionStatus) {
        this._connectionStatus = status;
    }

    public set disconnectTimeout(timeout: NodeJS.Timeout) {
        this._disconnectTimeout = timeout;
    }

    public get disconnectTimeout(): NodeJS.Timeout | null {
        return this._disconnectTimeout;
    }
    public get pingInterval(): NodeJS.Timeout | null {
        return this._pingInterval;
    }

    public set pingInterval(timeout: NodeJS.Timeout | null) {
        this._pingInterval = timeout;
    }

    public get disconnected(): boolean {
        return this._connectionStatus === EClientConnectionStatus.Disconnected ||
            this._connectionStatus === EClientConnectionStatus.DisconnectedFail ||
            this._connectionStatus === EClientConnectionStatus.NotConnected;
    }

    constructor(initialClient: IInitialPeer, session: IPeerSession) {
        super();
        this._userToken = initialClient.userToken;
        this._userId = initialClient.userId;
        this._status = initialClient.status;
        this._peerRole = initialClient.peerRole;
        this._session = session;
        logInfo({ event: "PeerCreated", message: "New Peer instance created", userId: this._userId, userToken: this._userToken, peerRole: this._peerRole });
    }

    public initClient(ws: AppEvent): void {
        logInfo({ event: "ClientInit", message: "Initializing client", userToken: this._userToken });
        this._createClient(ws);
    }

    private _createClient(ws: AppEvent): void {
        this._conn = ws;
        this._status = EClientStatus.Connected;
        this._connectionStatus = EClientConnectionStatus.Connected;
        logInfo({ event: "ClientCreated", message: "Client connection created", userToken: this._userToken, connectionStatus: this._connectionStatus });
    }

    public destroyPeer(): void {
        this._conn?.close();
        this._conn?.terminate();
        this._conn = undefined;
        this.removeAllListeners();
    }

}
