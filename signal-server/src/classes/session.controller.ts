import {WSMessage, WSSignalMessage} from "../models/ws-message.model";
import {IClient,} from "../models/client.model";
import {SenderReceiver} from "../models/sender-receiver.model";
import {EWebSocketEventType,} from "../enums/ws-message.enum";
import {RTCIceServer} from "../models/rtc-ice-server.model";
// import {getConnectionSessionManager} from "../functions/webrtc-session-manager";
import console from "console";
import {WsConnectionError} from "../enums/wsconnection-error.enum";
import {getUserManager, UserManager} from "../managers/user-manager";
import {ISession} from "../models/session.model";
import {EClientConnectionStatus} from "../enums/client-connection-status.enum";
import {EClientStatus} from "../enums/client-status.enum";
import {formatMessageForWS} from "../functions/helpers";
import WebSocket from "ws";
import {AppEvent} from "./base-event.class";

export class SessionController {
    private readonly _session!: ISession
    private _users: UserManager = getUserManager;
    private _currentSender!: IClient;
    private _currentReceiver!: IClient;
    constructor(session: ISession) {
        this._session = session;
    }

    public addUser(userToken: string, user: IClient) {
        try {
            this._users.addUser(userToken, user)
        } catch (e) {
            console.error(e)
        }
    }

    private ping(): void {

    }

    public initNewConnection(userToken: string, ws: AppEvent): void {
        const currentSender: IClient | undefined = this._users.getUser(userToken);
        const currentReceiver: IClient | undefined = this._users.getOppositeUser(userToken)
        if (!currentSender) {
            throw new Error('Invalid user')
        }
        if (currentReceiver) {
            this._currentReceiver = currentReceiver;
        }
        currentSender.conn = ws;
        currentSender.initClient({
            onDisconnectErr: this.closeConnectionsWhenPeerErr.bind(this)
        })
        this._currentSender = currentSender
    }

    private senderReceiverHandler(userToken: string, clients: IClient[]): SenderReceiver {
        let sender: IClient | undefined;
        const receivers: IClient[] = [];
        clients.forEach(client => {
            if (client.userToken === userToken) {
                sender = client;
            } else {
                receivers.push(client);
            }
        });
        if (!sender) {
            throw new Error("Receiver not found");
        }
        return { receivers, sender };
    }

    private setIClientStage(client: IClient, msg: WSMessage) {
        client.stage = msg.type;
    }

    private closeConnectionsWhenPeerErr(): void {
        const userToMessage: IClient | undefined = this._users.getUserByNot('connectionStatus', EClientConnectionStatus.DisconnectedFail);
        if (userToMessage) {
            const message: WSMessage = {
                msgType: 'peer',
                remotePeerStatus: EClientStatus.DisconnectedFail,
                session: this._session,
                peerStatus: userToMessage.status,
                type: EWebSocketEventType.ReconnectSignal

            }
        }

    }

    private handleConnect(msg: WSMessage) {
        this._currentSender.status = EClientStatus.Connected;
        const remotePeer: IClient | undefined = this._users.getOppositeUser(this._currentSender.userToken);
        const remotePeerStatus: EClientStatus = remotePeer?.status ?? EClientStatus.Unknown
        const wsMessage: WSMessage = {
            msgType: 'peer',
            session: msg.session,
            type: EWebSocketEventType.Connected,
            peerStatus:  this._currentSender.status,
            remotePeerStatus: remotePeerStatus,
            metadata: { userId: this._currentSender.userId }};
        console.log("HANDLE CONNECT")
        console.log("CURRENT SENDER", this._currentSender)
        this.sendMessageFor(this._currentSender, wsMessage)
    }

    private handleStart(msg: WSMessage) {
        let wsMessage: WSMessage;
        if (!this._currentReceiver || this._currentReceiver.status === EClientStatus.Unknown) {
            this._currentSender.status = EClientStatus.Waiting
            wsMessage = {
                msgType: 'peer',
                session: msg.session,
                type: EWebSocketEventType.Waiting,
                peerStatus: this._currentSender.status,
                remotePeerStatus: EClientStatus.Unknown
            };
            this.sendMessageFor(this._currentSender, wsMessage)
        } else {
            this.setStatusForAllPeers(EClientStatus.Connected)
            wsMessage = {
                msgType: 'peer',
                session: msg.session,
                type: EWebSocketEventType.Init,
                peerStatus: EClientStatus.Connected,
                remotePeerStatus: EClientStatus.Connected
            };
            this.sendMessageForAll(wsMessage);
        }
    }

    private setStatusForAllPeers(status: EClientStatus): void {
        this._users.getUsers().forEach(client => client.status = status)
    }

    private handleInitAccepted(msg: WSMessage) {
        const wsMessage: WSMessage = {
            msgType: 'peer',
            remotePeerStatus: msg.remotePeerStatus,
            peerStatus: msg.peerStatus,
            session: msg.session,
            type: EWebSocketEventType.InitAccepted
        };
    }

    private handleRoleAccepted(msg: WSMessage) {
        const wsMessage: WSMessage = {
            msgType: 'peer',
            remotePeerStatus: msg.remotePeerStatus,
            peerStatus: msg.peerStatus,
            session: msg.session,
            type: EWebSocketEventType.PrepareRTC
        };
    }

    private handleICEAccepted(msg: WSMessage) {

        const wsMessage: WSMessage = {
            msgType: 'peer',
            remotePeerStatus: msg.remotePeerStatus,
            peerStatus: msg.peerStatus,
            session: msg.session,
            type: EWebSocketEventType.ICEAccepted
        };
    }

    private handleICERequest(msg: WSMessage) {
        const iceServers: RTCIceServer[] = [
            { urls: 'stun:coturn:3478' },
            { urls: 'turn:coturn:3478', username: 'exampleuser', credential: 'examplepass' }
        ];
        const wsMessage: WSMessage = {
            msgType: 'peer',
            remotePeerStatus: msg.peerStatus,
            session: msg.session,
            type: EWebSocketEventType.ICEResponse,
            peerStatus: msg.remotePeerStatus,
            metadata: iceServers
        };
    }

    private handleRoleRequest(msg: WSMessage) {


        const wsMessage: WSMessage = {
            msgType: 'peer',
            remotePeerStatus: msg.remotePeerStatus,
            peerStatus: msg.peerStatus,
            session: msg.session,
            type: EWebSocketEventType.RoleResponse,
            metadata: { role: this._currentSender.peerRole }
        };
    }

    private handleOffer(msg: WSMessage) {
        if (msg.offer) {
            const wsMessage: WSMessage = {
                msgType: 'peer',
                remotePeerStatus: msg.remotePeerStatus,
                peerStatus: msg.peerStatus,
                session: msg.session,
                type: EWebSocketEventType.IncommingOffer,
                offer: msg.offer,
                candidate: msg.candidate
            };
            // const connectionManager = getConnectionSessionManager(this._session.sessionToken);
            // connectionManager.setOffer(msg.offer);
        } else {
            throw new Error(WsConnectionError.WEBRTC_OFFER_NOT_FOUND);
        }
    }

    private handleAnswer(msg: WSMessage) {
        if (msg.answer) {
            const wsMessage: WSMessage = {
                msgType: 'peer',
                remotePeerStatus: msg.remotePeerStatus,
                peerStatus: msg.peerStatus,
                session: msg.session,
                answer: msg.answer,
                type: EWebSocketEventType.Answer
            };
            // const webRTCSessionManager = getConnectionSessionManager(this._session.sessionToken);
            // webRTCSessionManager.setAnswer(msg.answer);
        } else {
            throw new Error(WsConnectionError.WEBRTC_ANSWER_NOT_FOUND);
        }
    }

    private handleCandidate(msg: WSMessage) {
        if (msg.candidate) {
            const wsMessage: WSMessage = {
                msgType: 'peer',
                remotePeerStatus: msg.remotePeerStatus,
                peerStatus: msg.peerStatus,
                session: msg.session,
                candidate: msg.candidate,
                type: EWebSocketEventType.Candidate,
                metadata: { userId: this._currentSender.userId }
            };
            // const webRTCSessionManager = getConnectionSessionManager(this._session.sessionToken);
            // webRTCSessionManager.addIceCandidate(msg.candidate);
        } else {
            throw new Error(WsConnectionError.ICE_CANDIDATE_NOT_FOUND);
        }
    }

    private handleListen(msg: WSMessage) {
        const wsMessage: WSMessage = {
            msgType: 'peer',
            remotePeerStatus: msg.remotePeerStatus,
            peerStatus: msg.peerStatus,
            session: msg.session,
            candidate: msg.candidate,
            type: EWebSocketEventType.Listen
        };
    }

    private handlePeerReady(msg: WSMessage) {
        const wsMessage: WSMessage = {
            msgType: 'peer',
            remotePeerStatus: msg.remotePeerStatus,
            peerStatus: msg.peerStatus,
            session: msg.session,
            candidate: msg.candidate,
            type: EWebSocketEventType.PeerReady
        };
    }

    private handleMsgReceived(msg: WSMessage) {
        const wsMessage: WSMessage = {
            msgType: 'peer',
            remotePeerStatus: msg.remotePeerStatus,
            peerStatus: msg.peerStatus,
            session: msg.session,
            candidate: msg.candidate,
            type: EWebSocketEventType.Ready
        };
    }

    public sendMessageFor(user: IClient, message: WSMessage): void {
        user.conn?.sendDataMessage(message)
    }

    public sendMessageForAll(message: WSMessage): void {
        this._currentSender.conn?.sendDataMessage(message);
        this._currentReceiver.conn?.sendDataMessage(message);
    }



    public processMessage(message: WSMessage): void {


            switch (message.type) {
                case EWebSocketEventType.Connect:
                    this.handleConnect(message);
                    break;
                case EWebSocketEventType.PeerReady:
                    this.handlePeerReady(message);
                    break;
                case EWebSocketEventType.MsgReceived:
                    this.handleMsgReceived(message);
                    break;
                case EWebSocketEventType.Listen:
                    this.handleListen(message);
                    break;
                case EWebSocketEventType.Candidate:
                    this.handleCandidate(message);
                    break;
                case EWebSocketEventType.Answer:
                    this.handleAnswer(message);
                    break;
                case EWebSocketEventType.Start:
                    this.handleStart(message);
                    break;
                case EWebSocketEventType.InitAccepted:
                    this.handleInitAccepted(message);
                    break;
                case EWebSocketEventType.ICERequest:
                    this.handleICERequest(message);
                    break;
                case EWebSocketEventType.ICEAccepted:
                    this.handleICEAccepted(message);
                    break;
                case EWebSocketEventType.RoleRequest:
                    this.handleRoleRequest(message);
                    break;
                case EWebSocketEventType.RoleAccepted:
                    this.handleRoleAccepted(message);
                    break;
                case EWebSocketEventType.Offer:
                    this.handleOffer(message);
                    break;
            }


    }
}

