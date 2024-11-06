import {IIncomingMessage, IOutgoingMessage} from "../models/ws-message.model";
import { ConnectionStateModel } from "../models/connection-state.model";
import { EWebSocketEventType } from '../enums/ws-message.enum';
import { EClientStatus } from "../enums/client-status.model";
import { PeerRole } from "../enums/peer-role.enum";
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

    private createWSMessage(data: Partial<IOutgoingMessage>, session: any): IOutgoingMessage {
        return <IOutgoingMessage>{session, ...data };
    }

    private async handleAnswer(message: IIncomingMessage, socket: AppEvent): Promise<void> {
        if (this.state.role !== PeerRole.Initiator) return;

        try {
            await this.state.peerConnection?.setRemoteDescription(new RTCSessionDescription(message.answer as RTCSessionDescriptionInit));
            this.state.peerConnection.onicecandidate = (event) => this.handleIceCandidate(event, socket);
            this.state.dataChannel!.onopen = () => {
                const openedMsg = this.createWSMessage(
                    {
                        type: EWebSocketEventType.PeerReady,
                        peerStatus: EClientStatus.WebRTCInitialization,
                    },
                    message.session
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

    private async processOffer(message: IIncomingMessage, socket: AppEvent): Promise<void> {
        this.state.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });
        await this.state.peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer as RTCSessionDescriptionInit));
        const answer = await this.state.peerConnection.createAnswer();
        await this.state.peerConnection.setLocalDescription(answer);
        this.state.peerConnection.onicecandidate = (event) => this.handleIceCandidate(event, socket);
        const wsAnswer = this.createWSMessage(
            {
                type: EWebSocketEventType.Answer,
                answer: this.state.peerConnection.localDescription as RTCSessionDescriptionInit,
                peerStatus: EClientStatus.WebRTCInitialization,
            },
            message.session
        );
        socket.sendWSMessage(wsAnswer);
    }

    private handleIceCandidate(event: RTCPeerConnectionIceEvent, socket: AppEvent): void {
        if (event.candidate) {
            const iceCandidateMsg = this.createWSMessage(
                { type: EWebSocketEventType.Candidate, candidate: event.candidate },
                this.state.peerConnection!.localDescription!.sdp
            );
            socket.sendWSMessage(iceCandidateMsg);
        }
    }

    private async handleOffer(message: IIncomingMessage, socket: AppEvent): Promise<void> {
        const inerval =setInterval( async () => {
            if (this.state.role === PeerRole.Joiner) {
                await this.processOffer(message, socket);
                clearInterval(inerval)
            }
        }, 200);

    }

    private handleIceResponse(message: IIncomingMessage, socket: AppEvent): void {
        const wsMessage = this.createWSMessage(
            {
                type: EWebSocketEventType.ICEAccepted,
                peerStatus: EClientStatus.DataSignalling,
            },
            message.session
        );
        socket.sendWSMessage(wsMessage);
    }

    private handleIceAccepted(message: IIncomingMessage, socket: AppEvent): void {
        const wsMessage = this.createWSMessage(
            {
                type: EWebSocketEventType.RoleRequest,
                peerStatus: EClientStatus.DataSignalling,
            },
            message.session
        );
        socket.sendWSMessage(wsMessage);
    }

    private handleRoleResponse(message: IIncomingMessage, socket: AppEvent): void {
        this.state.role = message.metadata.role;
        const wsMessage = this.createWSMessage(
            {
                type: EWebSocketEventType.RoleAccepted,
                peerStatus: EClientStatus.WebRTCInitialization,
            },
            message.session
        );
        socket.sendWSMessage(wsMessage);
    }

    private async handlePrepareRTCResponse(message: IIncomingMessage, socket: AppEvent): Promise<void> {
        this.state.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });

        this.state.dataChannel = this.state.peerConnection.createDataChannel("chat");
        if (this.state.role === PeerRole.Initiator) {

            const offer = await this.state.peerConnection.createOffer();
            await this.state.peerConnection.setLocalDescription(offer);

            const wsOffer = this.createWSMessage(
                {
                    type: EWebSocketEventType.Offer,
                    offer: this.state.peerConnection.localDescription as RTCSessionDescriptionInit,
                    peerStatus: EClientStatus.WebRTCInitialization,
                },
                message.session
            );
            socket.sendWSMessage(wsOffer);
        }
    }

    // private async waitForConnection(message: WSMessage, socket: AppEvent): Promise<boolean> {
    //     const msg = this.createWSMessage(
    //         { type: WsMessageEnum.Connect, remotePeerStatus: ClientStatus.Unknown, peerStatus: ClientStatus.Start },
    //         message.session
    //     );
    //     socket.sendWSMessage(msg);
    // }

    private handleConnected(message: IIncomingMessage, socket: AppEvent): void {
        this.state.userId = message.metadata.userId;
        const wsMessage = this.createWSMessage(
            { type: EWebSocketEventType.Start, peerStatus: EClientStatus.Connected},
            message.session
        );
        socket.sendWSMessage(wsMessage);
    }

    private handleInit(message: IIncomingMessage, socket: AppEvent): void {
        const wsMessage: IOutgoingMessage = this.createWSMessage(
            {
                type: EWebSocketEventType.InitAccepted,
                peerStatus: EClientStatus.Init,
           },
            message.session
        );
        socket.sendWSMessage(wsMessage);
    }

    private handleListen(incommingMessage: IIncomingMessage, socket: AppEvent): void {
        this.state.dataChannel?.send('Listening...');
        console.log("LISTENINGGGG")
    }

    private handleCandidate(incommingMessage: IIncomingMessage): void {
        const candidate = new RTCIceCandidate(incommingMessage.candidate);
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

    private handleInitAccepted(incommingMessage: IIncomingMessage, socket: AppEvent): void {
        const wsMessage: IOutgoingMessage = {
            type: EWebSocketEventType.ICERequest,
            session: incommingMessage.session,
            peerStatus: EClientStatus.DataSignalling,
        };
        socket.sendWSMessage(wsMessage);
    }

    private handlePeerReady(incommingMessage: IIncomingMessage, socket: AppEvent): void {
        const wsMessage: IOutgoingMessage = {
            type: EWebSocketEventType.Listen,
            session: incommingMessage.session,
            peerStatus: EClientStatus.WebRTCInitialization,
        };
        this.state.dataChannel.onmessage = (msg) => {
            const wsMessage: IOutgoingMessage = {
                type: EWebSocketEventType.MsgReceived,
                session: incommingMessage.session,
                peerStatus: EClientStatus.WebRTCInitialization,
            };
            socket.sendWSMessage(wsMessage);
        };
        console.log('HANDLE PEER READY')
        socket.sendWSMessage(wsMessage);
    }

    private async actionForMessage(incommingMessage: IIncomingMessage, socket: AppEvent): Promise<void> {
        if (!incommingMessage || !socket) {
            console.error('No message or socket found');
            return;
        }
        try {
            switch (incommingMessage.type) {
                case EWebSocketEventType.Listen:
                    this.handleListen(incommingMessage, socket);
                    break;
                case EWebSocketEventType.PeerReady:
                    this.handlePeerReady(incommingMessage, socket);
                    break;
                case EWebSocketEventType.Connect:
                    await this.handlePrepareRTCResponse(incommingMessage, socket);
                    break;
                case EWebSocketEventType.Init:
                    this.handleInitAccepted(incommingMessage, socket);
                    break;
                case EWebSocketEventType.ICEResponse:
                    this.handleIceResponse(incommingMessage, socket);
                    break;
                case EWebSocketEventType.ICEAccepted:
                    this.handleIceAccepted(incommingMessage, socket);
                    break;
                case EWebSocketEventType.RoleResponse:
                    this.handleRoleResponse(incommingMessage, socket);
                    break;
                // case EWebSocketEventType.PrepareRTC:
                //     await this.handlePrepareRTCResponse(incommingMessage, socket);
                //     break;
                case EWebSocketEventType.IncommingOffer:
                    await this.handleOffer(incommingMessage, socket);
                    break;
                case EWebSocketEventType.Answer:
                    await this.handleAnswer(incommingMessage, socket);
                    break;
                case EWebSocketEventType.Candidate:
                    this.handleCandidate(incommingMessage);
                    break;
                default:
                    console.warn(`Unhandled message type: ${incommingMessage.type}`);
                    break;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }
}

export const getRTCConnection = (): IRTCConnection => RTCConnection.getInstance();
