import { IInitialClient } from "../models/client.model";
import { PeerRole } from "../enums/peer-role.enum";
import { ISession } from "../models/session.model";
import { EClientConnectionStatus } from "../enums/client-connection-status.enum";
import { IClientCallbacks } from "../models/client-callbacks.model";
import { EClientStatus } from "../enums/client-status.enum";
import { EWebSocketEventType } from "../enums/ws-message.enum";
import { AppEvent } from "./base-event.class";
import { IIncomingMessage, IOutgoingMessage } from "../models/ws-message.model";
import { MessageQueue } from "./message-queue";
import { EInternalMessageType } from "../enums/internal-message-type.enum";
import { PeerEmitter } from "./peer-emitter.abstract";
import { logWarning, logError, logInfo } from "../error-logger/error-looger";

export class Peer extends PeerEmitter {
    private readonly _pingIntervalDuration: number = 2000;
    private readonly _timeLimit: number = 6000;
    private _peerRole: PeerRole;
    private _session: ISession;
    private _status: EClientStatus;
    private _userId: string;
    private _userToken: string;
    private _pingInterval: NodeJS.Timeout | null = null;
    private _conn: AppEvent | undefined;
    private _connectionStatus: EClientConnectionStatus = EClientConnectionStatus.NotConnected;
    private _callbacks: IClientCallbacks | null = null;
    private _partnerPeers: Map<string, Peer> = new Map<string, Peer>();
    private _messagesQueue: MessageQueue<IIncomingMessage> = new MessageQueue<IIncomingMessage>();

    public get userToken(): string {
        return this._userToken;
    }

    public get session(): ISession {
        return this._session;
    }

    public get conn(): AppEvent {
        if (!this._conn) {
            throw new Error('No connection found');
        }
        return this._conn;
    }

    public get peerRole(): PeerRole {
        return this._peerRole;
    }

    public get connectionStatus(): EClientConnectionStatus {
        return this._connectionStatus;
    }

    public get disconnected(): boolean {
        return this._connectionStatus === EClientConnectionStatus.Disconnected ||
            this._connectionStatus === EClientConnectionStatus.DisconnectedFail ||
            this._connectionStatus === EClientConnectionStatus.NotConnected;
    }

    constructor(initialClient: IInitialClient) {
        super();
        this._userToken = initialClient.userToken;
        this._session = initialClient.session;
        this._userId = initialClient.userId;
        this._status = initialClient.status;
        this._peerRole = initialClient.peerRole;
        logInfo({ event: "PeerCreated", message: "New Peer instance created", userId: this._userId, userToken: this._userToken, peerRole: this._peerRole });
    }

    public initClient(ws: AppEvent): void {
        logInfo({ event: "ClientInit", message: "Initializing client", userToken: this._userToken });
        this._createClient(ws);
        this._dataMessageHandler();
    }

    private _createClient(ws: AppEvent): void {
        this._conn = ws;
        this._status = EClientStatus.Connected;
        this._connectionStatus = EClientConnectionStatus.Connected;
        logInfo({ event: "ClientCreated", message: "Client connection created", userToken: this._userToken, connectionStatus: this._connectionStatus });
    }

    public addPartner(peer: Peer | Peer[]): void {
        if (Array.isArray(peer)) {
            peer.forEach(newPeer => this._addPartnerIfAbsent(newPeer));
        } else {
            this._addPartnerIfAbsent(peer);
        }
        this.emitStatus({ status: EInternalMessageType.Added });
        logInfo({ event: "PartnerAdded", message: "Partner added to peer", userToken: this._userToken, partnerCount: this._partnerPeers.size });
    }

    private _isSomeoneConnected(): boolean {
        return Array.from(this._partnerPeers.values()).some(partner => !partner.disconnected);
    }

    private _addPartnerIfAbsent(peer: Peer): void {
        if (this._partnerPeers.has(peer._userToken)) {
            logWarning({ event: "DuplicatePartner", message: `Peer ${peer._userToken} already exists`, userToken: this._userToken });
            return;
        }
        logInfo({ event: "NewPartnerAdded", message: "New partner added", partnerUserToken: peer._userToken });
        this._addPartnerWithCallback(peer);
    }

    private _addPartnerWithCallback(peer: Peer): void {
        this._partnerPeers.set(peer._userToken, peer);

        peer.onStatus(internalMessage => {
            logInfo({ event: "ListenPeers", message: "Listening to peer status updates", internalMessage, peerRole: this._peerRole, partnerRole: peer.peerRole });
            if (internalMessage.status === EInternalMessageType.Added) {
                this.emitStatus({ status: EInternalMessageType.Join });
            }
            if (internalMessage.status === EInternalMessageType.Join && !this._messagesQueue.isEmpty()) {
                try {
                    this._sendQueuedMessages(peer);
                } catch (e) {
                    logError({ event: "SendQueuedMessagesError", message: "Error sending queued messages", error: e });
                }
            }
            if (internalMessage.status === EInternalMessageType.Data) {
                this._conn?.sendDataMessage(internalMessage.clientMessage as IOutgoingMessage);
            }
        });
    }

    private _generateMessageId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private _sendQueuedMessages(peer: Peer): void {
        while (!this._messagesQueue.isEmpty()) {
            const message = this._messagesQueue.dequeue();
            logInfo({ event: "SendQueuedMessage", message: "Sending queued message", userToken: this._userToken, messageData: message });
            peer.conn.sendDataMessage(message as IIncomingMessage);
        }
    }

    private _dataMessageHandler(): void {
        if (!this._conn) {
            logError({ event: "DataMessageError", message: "No connection available for data messages", userToken: this._userToken });
            return;
        }

        this._conn.on('dataMessage', (data: IIncomingMessage) => {
            this._status = data.peerStatus;
            logInfo({ event: "DataMessageReceived", message: "Data message received", data });

            if (!this._isSomeoneConnected()) {
                this._messagesQueue.enqueue(data);
                logInfo({ event: "DataMessageQueued", message: "Data message queued as no partners are connected", data });
            }

            this.emitStatus({ status: EInternalMessageType.Data, clientMessage: data });
        });
    }

    private startPing(): void {
        const sendPing = () => {
            if (!this._conn) {
                logWarning({ event: "PingError", message: "No connection available for ping", userToken: this._userToken });
                return;
            }

            logInfo({ event: "PingSent", message: "Sending ping message", session: this._session });
            this._conn.sendPingMessage(this._session);

            this._pingInterval = setTimeout(() => {
                this._connectionStatus = EClientConnectionStatus.DisconnectedFail;
                this._conn?.close();
                this._callbacks?.onDisconnectErr();
                this._pingInterval = null;
                logError({ event: "PingTimeout", message: "Ping timeout, connection closed", userToken: this._userToken });
            }, this._timeLimit);

            this._conn.once('signal', data => {
                if (data.type === EWebSocketEventType.Pong) {
                    clearTimeout(this._pingInterval as NodeJS.Timeout);
                    this._pingInterval = null;
                    logInfo({ event: "PongReceived", message: "Pong received from peer", userToken: this._userToken });
                    setTimeout(sendPing, this._pingIntervalDuration);
                }
            });
        };

        if (!this._pingInterval) {
            sendPing();
        }
    }
}
