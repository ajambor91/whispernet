import { WSMessage, WSSignalMessage } from "../models/ws-message.model";
import { ConnectionStateModel } from "../models/connection-state.model";
import { WsMessageEnum } from '../enums/ws-message.enum';
import { ClientStatus } from "../enums/client-status.model";
import { PeerRole } from "../enums/peer-role.enum";
import { IEventMessage } from "../models/event-message.model";
import { AppEvent } from "./app-event.singleton";
import { IRTCConnection } from "../interfaces/rtc-connection.model.interface";

class RTCConnection implements IRTCConnection {
    private static _instance: RTCConnection;
    private _appEvent: AppEvent = AppEvent.getInstance();
    private state: ConnectionStateModel;
    private iceServers: RTCIceServer[];
    private iceCandidatesQueue: RTCIceCandidate[] = [];

    private constructor() {
        this.state = {
            peerConnection: null,
            dataChannel: null,
            role: null,
            userId: null,
            stage: null
        };
        this.iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
    }

    public static getInstance(): RTCConnection {
        if (!this._instance) {
            this._instance = new RTCConnection();
        }
        return this._instance;
    }

    public handleMessage(): void {
        this._appEvent.on('dataMessage', data => {
            this.actionForMessage(data, this._appEvent);
        });
    }

    private createWSMessage(data: Partial<WSMessage>, session: any): WSMessage {
        return <WSMessage>{ msgType: 'peer', session, ...data };
    }

    private async handleAnswer(message: IEventMessage, socket: AppEvent): Promise<void> {
        if (this.state.role !== PeerRole.Initiator) return;

        try {
            if ("answer" in message.data) {
                await this.state.peerConnection?.setRemoteDescription(new RTCSessionDescription(message.data.answer as RTCSessionDescriptionInit));
            }
            this.state.dataChannel!.onopen = () => {
                const openedMsg = this.createWSMessage(
                    {
                        type: WsMessageEnum.PeerReady,
                        peerStatus: ClientStatus.Prepare,
                        remotePeerStatus: ClientStatus.Unknown
                    },
                    message.data.session
                );
                socket.sendWSMessage(openedMsg);
            };
            this.state.peerConnection!.onconnectionstatechange = () => {
                if (this.state.peerConnection?.connectionState === 'failed') {
                    console.error('WebRTC connection failed - check ICE configuration.');
                }
            };
        } catch (error) {
            console.error('Error setting remote description:', error);
        }
    }

    private async processOffer(message: WSMessage, socket: AppEvent): Promise<void> {
        this.state.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });
        await this.state.peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer as RTCSessionDescriptionInit));
        const answer = await this.state.peerConnection.createAnswer();
        await this.state.peerConnection.setLocalDescription(answer);

        const wsAnswer = this.createWSMessage(
            {
                type: WsMessageEnum.Answer,
                answer: this.state.peerConnection.localDescription as RTCSessionDescriptionInit,
                peerStatus: ClientStatus.Prepare,
                remotePeerStatus: message.peerStatus
            },
            message.session
        );
        socket.sendWSMessage(wsAnswer);
    }

    private handleIceCandidate(event: RTCPeerConnectionIceEvent, socket: AppEvent): void {
        if (event.candidate) {
            const iceCandidateMsg = this.createWSMessage(
                { type: WsMessageEnum.Candidate, candidate: event.candidate },
                this.state.peerConnection!.localDescription!.sdp
            );
            socket.sendWSMessage(iceCandidateMsg);
        }
    }

    private async handleOffer(message: WSMessage, socket: AppEvent): Promise<void> {
        if (this.state.role === PeerRole.Joiner) {
            await this.processOffer(message, socket);
        }
    }

    private handleIceResponse(message: WSMessage, socket: AppEvent): void {
        const wsMessage = this.createWSMessage(
            {
                type: WsMessageEnum.ICEAccepted,
                peerStatus: ClientStatus.Prepare,
                remotePeerStatus: message.remotePeerStatus
            },
            message.session
        );
        socket.sendWSMessage(wsMessage);
    }

    private handleIceAccepted(message: WSMessage, socket: AppEvent): void {
        const wsMessage = this.createWSMessage(
            {
                type: WsMessageEnum.RoleRequest,
                peerStatus: ClientStatus.Prepare,
                remotePeerStatus: message.remotePeerStatus
            },
            message.session
        );
        socket.sendWSMessage(wsMessage);
    }

    private handleRoleResponse(message: WSMessage, socket: AppEvent): void {
        this.state.role = message.metadata.role;
        const wsMessage = this.createWSMessage(
            {
                type: WsMessageEnum.RoleAccepted,
                peerStatus: ClientStatus.Prepare,
                remotePeerStatus: message.remotePeerStatus
            },
            message.session
        );
        socket.sendWSMessage(wsMessage);
    }

    private async handlePrepareRTCResponse(message: WSMessage, socket: AppEvent): Promise<void> {
        if (this.state.role === PeerRole.Initiator) {
            this.state.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });
            this.state.peerConnection.onicecandidate = (event) => this.handleIceCandidate(event, socket);

            this.state.dataChannel = this.state.peerConnection.createDataChannel("chat");
            const offer = await this.state.peerConnection.createOffer();
            await this.state.peerConnection.setLocalDescription(offer);

            const wsOffer = this.createWSMessage(
                {
                    type: WsMessageEnum.Offer,
                    offer: this.state.peerConnection.localDescription as RTCSessionDescriptionInit,
                    peerStatus: ClientStatus.Prepare,
                    remotePeerStatus: message.peerStatus
                },
                message.session
            );
            socket.sendWSMessage(wsOffer);
        }
    }

    private async waitForConnection(message: WSMessage, socket: AppEvent): Promise<boolean> {
        const msg = this.createWSMessage(
            { type: WsMessageEnum.Connect, remotePeerStatus: ClientStatus.Unknown, peerStatus: ClientStatus.Start },
            message.session
        );
        socket.sendWSMessage(msg);
    }

    private handlePing(msg: WSSignalMessage, socket: AppEvent): void {
        const wsSignalMsg: WSSignalMessage = { msgType: 'signal', type: WsMessageEnum.Pong, session: msg.session };
        socket.sendPong(wsSignalMsg);
    }

    private handleConnected(message: WSMessage, socket: AppEvent): void {
        this.state.userId = message.metadata.userId;
        const wsMessage = this.createWSMessage(
            { type: WsMessageEnum.Start, peerStatus: ClientStatus.Prepare, remotePeerStatus: message.remotePeerStatus },
            message.session
        );
        socket.sendWSMessage(wsMessage);
    }

    private handleInit(message: WSMessage, socket: AppEvent): void {
        const wsMessage = this.createWSMessage(
            {
                type: WsMessageEnum.InitAccepted,
                peerStatus: ClientStatus.Init,
                remotePeerStatus: message.remotePeerStatus
            },
            message.session
        );
        socket.sendWSMessage(wsMessage);
    }

    private handleListen(message: WSMessage | WSSignalMessage, socket: AppEvent): void {
        this.state.dataChannel?.send('Listening...');
    }

    private handleCandidate(message: WSMessage): void {
        const candidate = new RTCIceCandidate(message.candidate);
        if (this.state.peerConnection?.remoteDescription && this.state.role !== PeerRole.Joiner) {
            try {
                this.state.peerConnection.addIceCandidate(candidate);
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        } else {
            this.iceCandidatesQueue.push(candidate);
        }
    }

    private handleInitAccepted(message: WSMessage, socket: AppEvent): void {
        const wsMessage: WSMessage = {
            msgType: 'peer',
            type: WsMessageEnum.ICERequest,
            session: message.session,
            peerStatus: ClientStatus.Prepare,
            remotePeerStatus: message.peerStatus,
        };
        socket.sendWSMessage(wsMessage);
    }

    private handlePeerReady(message: WSMessage, socket: AppEvent): void {
        const wsMessage: WSMessage = {
            msgType: 'peer',
            type: WsMessageEnum.Listen,
            session: message.session,
            peerStatus: ClientStatus.Unknown,
            remotePeerStatus: ClientStatus.Prepare
        };
        this.state.dataChannel.onmessage = (msg) => {
            const wsMessage: WSMessage = {
                msgType: 'peer',
                type: WsMessageEnum.MsgReceived,
                session: message.session,
                peerStatus: ClientStatus.Unknown,
                remotePeerStatus: ClientStatus.Prepare
            };
            socket.sendWSMessage(wsMessage);
        };
        socket.sendWSMessage(wsMessage);
    }

    private async actionForMessage(message: WSMessage, socket: AppEvent): Promise<void> {
        if (!message || !socket) {
            console.error('No message or socket found');
            return;
        }
        try {
            switch (message.type) {
                case WsMessageEnum.Listen:
                    this.handleListen(message, socket);
                    break;
                case WsMessageEnum.PeerReady:
                    this.handlePeerReady(message, socket);
                    break;
                case WsMessageEnum.Connected:
                    this.handleConnected(message, socket);
                    break;
                case WsMessageEnum.Init:
                    this.handleInit(message, socket);
                    break;
                case WsMessageEnum.InitAccepted:
                    this.handleInitAccepted(message, socket);
                    break;
                case WsMessageEnum.ICEResponse:
                    this.handleIceResponse(message, socket);
                    break;
                case WsMessageEnum.ICEAccepted:
                    this.handleIceAccepted(message, socket);
                    break;
                case WsMessageEnum.RoleResponse:
                    this.handleRoleResponse(message, socket);
                    break;
                case WsMessageEnum.PrepareRTC:
                    await this.handlePrepareRTCResponse(message, socket);
                    break;
                case WsMessageEnum.IncommingOffer:
                    await this.handleOffer(message, socket);
                    break;
                case WsMessageEnum.Answer:
                    await this.handleAnswer(message, socket);
                    break;
                case WsMessageEnum.Candidate:
                    this.handleCandidate(message);
                    break;
                case WsMessageEnum.Ping:
                    this.handlePing(message, socket);
                    break;
                default:
                    console.warn(`Unhandled message type: ${message.type}`);
                    break;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }
}

export const getRTCConnection = (): IRTCConnection => RTCConnection.getInstance();
