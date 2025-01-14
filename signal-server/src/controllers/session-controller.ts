import {IInitialPeer} from "../models/peer.model";
import {Peer} from "../classes/peer";
import {EWebSocketEventType} from "../enums/ws-message.enum";
import {AppEvent} from "../classes/app-event";
import {logError, logInfo, logWarning} from "../error-logger/error-looger";
import {IPeerSession, ISession} from "../models/session.model";
import {PeerRole} from "../enums/peer-role.enum";
import {Session} from "../classes/session";
import {ESessionStatus} from "../enums/session-status.enum";
import {IInternalMessage} from "../models/internal-message.model";
import {EInternalMessageType} from "../enums/internal-message-type.enum";
import {IIncomingMessage, IOutgoingMessage, ITechnicalMessage} from "../models/ws-message.model";
import {EClientConnectionStatus} from "../enums/client-connection-status.enum";
import {sendKafkaMessage} from "../classes/kafka";
import {EKafkaMessageSendTypes} from "../enums/kafka-message-send-types.enum";
import {EClientStatus} from "../enums/client-status.enum";

type PeerState = {
    client: Peer;
    pendingOffer: boolean;
    isInitiator: boolean;
};

export class SessionController extends Session {
    private readonly _maxPeersPerSession: number = 2
    private readonly _clientMap: Map<string, PeerState> = new Map();
    private readonly _disconnectTimeout: number = 10000;

    constructor(session: ISession) {
        super();
        this._sessionStatus = session.sessionStatus;
        this._sessionToken = session.sessionToken;
        this._addUser(session.peerClients)
    }
    public initializePeerConnection(peer: Peer, appEvent: AppEvent): void {
        try {
            logInfo({ event: "InitializePeerConnection", message: "Initializing peer connection", userToken: peer.userToken });
            peer.initClient(appEvent);
            const existingClients: Peer[] = this.getUsersSkipped(peer.userToken) as Peer[];
            existingClients.forEach(existingClient => {
                if(!existingClient.hasPartner(peer)) {
                    existingClient.onStatus(internalMessage => this._peerOnStatus(internalMessage, peer, existingClient));
                    existingClient.onCloseConnection(technicalMsg => this._peerOnCloseDisconnect(technicalMsg, peer, existingClient))
                }

                if (!peer.hasPartner(existingClient)) {
                    peer.addParmter(existingClient);
                    peer.onStatus(internalMessage => this._peerOnStatus(internalMessage,existingClient, peer));
                    peer.onCloseConnection(technicalMsg => this._peerOnCloseDisconnect(technicalMsg, existingClient, peer))
                }

            });
            peer.emitStatus({ status: EInternalMessageType.Added });

            this._dataMessageHandler(peer);
            this._closeConnectionHandler(peer)
            this._startPing(peer);
            appEvent.sendDataMessage({
                sessionToken: peer.session.sessionToken,
                type: EWebSocketEventType.Connect
            });
        } catch (e) {
            logError({ event: "InitializePeerConnectionError", message: "Error initializing peer connection", error: e });
        }
    }

    private _peerOnCloseDisconnect(message: ITechnicalMessage, peer: Peer, partnerPeer: Peer): void {
        try {
            peer.conn.sendDataMessage({
                sessionToken: this._sessionToken as string,
                type: EWebSocketEventType.SessionInfo,
                payload: "Partner disconnected"
            });
            if (partnerPeer.pingInterval) {
                clearTimeout(partnerPeer.pingInterval)
                partnerPeer.pingInterval = null;
            }

            if (partnerPeer.sendPingTimeout) {
                clearTimeout(partnerPeer.sendPingTimeout);
                partnerPeer.sendPingTimeout = null;
            }

            this._startDisconnectTimeout(peer, partnerPeer);
            if (!this._sessionToken) {
                throw new Error("Session token is undefined")
            }
            sendKafkaMessage({
                type: EKafkaMessageSendTypes.DISCONNECT_USER,
                message: {
                    sessionToken: this._sessionToken,
                    sessionStatus: ESessionStatus.Break,
                    peerClients: [{
                        peerRole: partnerPeer.peerRole,
                        userToken: partnerPeer.userToken,
                        status: EClientStatus.DisconnectedFail,
                        userId: partnerPeer.userId
                    }]
                }})
            logInfo({ event: "SendCloseConnectionMessage", message: "Message that partner closed connection was send" });
        } catch (e: any) {
            logError({ event: "CloseConnectionError", message: e.message, userToken: peer.userToken });

        }
    }

    private _onNoReconnect(peer: Peer, partnerPeer: Peer): void {
        try {
            peer.conn.sendDataMessage({
                sessionToken: this._sessionToken as string,
                type: EWebSocketEventType.SessionInfo,
                payload: "Partner removed from session. Please create new session."
            });            partnerPeer.destroyPeer();
            this._clientMap.delete(peer.userToken);
            if (!this._sessionToken) {
                throw new Error("Session token is undefined")
            }
            sendKafkaMessage({
                type: EKafkaMessageSendTypes.REMOVE_USER,
                message: {
                    sessionToken: this._sessionToken,
                    sessionStatus: ESessionStatus.Interrupted,
                    peerClients: [{
                        peerRole: partnerPeer.peerRole,
                        userToken: partnerPeer.userToken,
                        status: EClientStatus.Gone,
                        userId: partnerPeer.userId
                    }]
                }})
            logInfo({ event: "SendCloseConnectionMessage", message: "Message that partner closed connection was send" });
        } catch (e: any) {
            logError({ event: "CloseConnectionError", message: e.message, userToken: peer.userToken });

        }
    }

    private _peerOnStatus(internalMessage: IInternalMessage, peer: Peer, partner: Peer): void {
        try {
            logInfo({
                event: "ListenPeers",
                message: "Listening to peer status updates",
                internalMessage,
                peerRole: peer.peerRole,
                partnerRole: partner.peerRole
            });
            if (internalMessage.status === EInternalMessageType.Added) {
                peer.emitStatus({status: EInternalMessageType.Join});
            }
            if (internalMessage.status === EInternalMessageType.Join) {
                try {
                    if(partner.peerRole as string === "INITIATOR") {
                        this._sendSessionOffer(peer);

                    }
                } catch (e) {
                    logError({event: "SendQueuedMessagesError", message: "Error sending queued messages", error: e});
                }
            }
            this._handleOffer(internalMessage.clientMessage as IIncomingMessage);
            if (internalMessage.status === EInternalMessageType.Data) {
                peer.conn?.sendDataMessage(internalMessage.clientMessage as IOutgoingMessage);
            }
        } catch (e: any) {
            logError({ event: "OnStatusError", message: e.message, userToken: peer.userToken });

        }
    }
    private _dataMessageHandler(peer: Peer): void {

        if (!peer.conn) {
            logError({ event: "DataMessageError", message: "No connection available for data messages", userToken: peer.userToken });
            return;
        }

        peer.conn.on('dataMessage', (data: IIncomingMessage) => {
            logInfo({ event: "DataMessageReceived", message: "Data message received", data });
            this._handleOffer(data)
            logInfo({ event: "DataMessageQueued", message: "Data message queued as no partners are connected", data });
            peer.emitStatus({ status: EInternalMessageType.Data, clientMessage: data });
        });
    }

    private _closeConnectionHandler(peer: Peer): void {
        if (!peer.conn) {
            logError({ event: "CloseConnectionError", message: "No connection available for data messages", userToken: peer.userToken });
            return;
        }

        peer.conn.on('close', () => {
            peer.emitCloseConnection({userToken: peer.userToken});
        })
    }
    private _handleOffer(internalMessage: IIncomingMessage): void {
        if (internalMessage?.type === 'offer') {
            this._sessionOffer = internalMessage;
        }
    }

    private _sendSessionOffer(peer: Peer) : void {
        peer.conn.sendDataMessage(this._sessionOffer);
    }


    public getUsers(): Peer[] {
        logInfo({ event: "GetUsers", message: "Retrieving all users in session" });
        return Array.from(this._clientMap.values()).map(state => state.client);
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

    public isInitiator(userToken: string): boolean {
        const peerState = this._clientMap.get(userToken);
        const isInitiator = peerState ? peerState.isInitiator : false;
        logInfo({ event: "IsInitiator", message: "Checking if user is initiator", userToken, isInitiator });
        return isInitiator;
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
                this.peerClients.push(client);
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
    private readonly _pingIntervalDuration: number = 2000;
    private readonly _timeLimit: number = 6000;
    private _startPing(peer: Peer): void {

        const sendPing = () => {
            try {
                if (!peer.conn) {
                    logWarning({
                        event: "PingError",
                        message: "No connection available for ping",
                        userToken: peer.userToken
                    });
                    return;
                }
                logInfo({event: "PingSent", message: "Sending ping message", session: this._sessionToken});
                peer.conn.sendPingMessage(this._sessionToken as string);
                peer.pingInterval = setTimeout(() => {
                    peer.connectionStatus = EClientConnectionStatus.DisconnectedFail;
                    peer.conn?.close();
                    peer.emitCloseConnection({userToken: peer.userToken});
                    peer.pingInterval = null;
                    logError({
                        event: "PingTimeout",
                        message: "Ping timeout, connection closed",
                        userToken: peer.userToken
                    });
                }, this._timeLimit);

                peer.conn.once('signal', data => {
                    if (data.type === EWebSocketEventType.Pong) {
                        clearTimeout(peer.pingInterval as NodeJS.Timeout);
                        peer.pingInterval = null;
                        logInfo({event: "PongReceived", message: "Pong received from peer", userToken: peer.userToken});
                        peer.sendPingTimeout = setTimeout(sendPing, this._pingIntervalDuration);
                    }
                });
            }
            catch (e: any) {
                logError({ event: "PingError", message: e.message, userToken: peer.userToken });
            }
        };

        if (!peer.pingInterval) {
            sendPing();
        }
    }

    private _startDisconnectTimeout(peer: Peer, partner: Peer): void {
        peer.disconnectTimeout = setTimeout(() => {
            this._onNoReconnect(peer, partner);
        }, this._disconnectTimeout)
    }
}
