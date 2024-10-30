import {IClient} from "../models/client.model";
import {PeerRole} from "../enums/peer-role.enum";
import {ISession} from "../models/session.model";
import {EClientConnectionStatus} from "../enums/client-connection-status.enum";
import WebSocket from "ws";
import {IClientCallbacks} from "../models/client-callbacks.model";
import {EClientStatus} from "../enums/client-status.enum";
import {EWebSocketEventType} from "../enums/ws-message.enum";
import {WSSignalMessage} from "../models/ws-message.model";
import {decodeMessage, formatMessageForWS} from "../functions/helpers";
import console from "console";
import {SessionController} from "./session.controller";

export class Client implements IClient {
    private readonly _pingIntervalDuration: number = 1000;
    private readonly _timeLimit: number = 5000;
    private _peerRole: PeerRole;
    private _session: ISession;
    private _stage: EWebSocketEventType;
    private _status: EClientStatus;
    private _userId: string;
    private _userToken: string;
    private _pingInterval: NodeJS.Timeout | null = null;
    private _conn: WebSocket | undefined;
    private _connectionStatus: EClientConnectionStatus = EClientConnectionStatus.NotConnected;
    private _callbacks!: IClientCallbacks | null;

    constructor(client: IClient) {
        this._userToken = client.userToken;
        this._userId = client.userId;
        this._session = client.session;
        this._peerRole = client.peerRole;
        this._status = client.status;
        this._stage = client.stage;
        this._conn = client.conn;
    }

    public get conn(): WebSocket | undefined {
        return this._conn;
    }
    public set conn(connection: WebSocket | undefined) {
        this._conn = connection;
    }

    public get connectionStatus(): EClientConnectionStatus {
        return this._connectionStatus;
    }
    public set connectionStatus(status: EClientConnectionStatus) {
        this._connectionStatus = status;
    }

    public get peerRole(): PeerRole {
        return this._peerRole;
    }
    public set peerRole(role: PeerRole) {
        this._peerRole = role;
    }

    public get session(): ISession {
        return this._session;
    }
    public set session(session: ISession) {
        this._session = session;
    }

    public get stage(): EWebSocketEventType {
        return this._stage;
    }
    public set stage(stage: EWebSocketEventType) {
        this._stage = stage;
    }

    public get status(): EClientStatus {
        return this._status;
    }
    public set status(status: EClientStatus) {
        this._status = status;
    }

    public get userId(): string {
        return this._userId;
    }
    public set userId(id: string) {
        this._userId = id;
    }

    public get userToken(): string {
        return this._userToken;
    }
    public set userToken(token: string) {
        this._userToken = token;
    }

    public get pingInterval(): NodeJS.Timeout | null {
        return this._pingInterval;
    }
    public set pingInterval(interval: NodeJS.Timeout | null) {
        this._pingInterval = interval;
    }

    public initClient(clientCallbacks: IClientCallbacks): void {
        this._callbacks = clientCallbacks;
        this.sendPing();
    }



    private sendPing(): void {
            const wsMessage: WSSignalMessage = {
                msgType: 'signal',
                session: this._session,
                type: EWebSocketEventType.Ping
            }
            this._conn?.send(formatMessageForWS(wsMessage));
            this._pingInterval = setTimeout(() => {
                this._connectionStatus = EClientConnectionStatus.DisconnectedFail;
                this._conn?.close();
                this._callbacks?.onDisconnectErr();
            }, this._timeLimit);



        if (!this._pingInterval) {
            this.sendPing();
        }
    }

    public handlePong(wsSignalMsg: WSSignalMessage): void {
        if (wsSignalMsg.type === EWebSocketEventType.Pong) {
            clearTimeout(this._pingInterval as NodeJS.Timeout);
            setTimeout(this.sendPing, this._pingIntervalDuration);
        }
    }
}
