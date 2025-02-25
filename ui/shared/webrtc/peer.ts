import {EventEmitter} from "eventemitter3";
import {AppEvent} from "./app-event.singleton";
import {EClientStatus} from "../enums/client-status.enum";
import {IAuth} from "../interfaces/auth.interface";
import {getAuth} from "./auth";
import {IPingPong} from "../interfaces/ping-pong.interface";
import {getPingPong} from "./ping-pong.singleton";
import {IIncomingMessage, IInitialWebRTCMessage, IOutgoingMessage} from "../models/ws-message.model";
import {ConnectionStateModel} from "../models/connection-state.model";
import {PeerRole} from "../enums/peer-role.enum";
import {EWebSocketEventType} from "../enums/ws-message.enum";
import {IPeerState} from "../slices/createSession.slice";
import {logError, logInfo, logWarning} from "../error-logger/web";
import {IPeer} from "../interfaces/peer.interface";

class Peer extends EventEmitter implements IPeer {
    private static _instance: Peer;
    private readonly _auth: IAuth;
    private readonly _ping: IPingPong;
    private readonly _appEvent: AppEvent;
    private readonly _sessionToken: string;
    private readonly _peerRole: PeerRole;
    private _status: EClientStatus = EClientStatus.NotConnected;
    private _rtcState!: ConnectionStateModel;
    private iceServers = [{urls: 'stun:stun.l.google.com:19302'}];

    constructor(peerState: IPeerState) {
        super();
        this._sessionToken = peerState.sessionToken;
        this._peerRole = peerState.peerRole
        this._rtcState = {
            dataChannel: null,
            peerConnection: null,
            role: null,
            userId: null,
            stage: null
        }
        try {
            this._appEvent = AppEvent.getInstance()
            this._auth = getAuth(this)
            this._ping = getPingPong()
            this._initClient();
            this._appEvent.on('reconnected', () => {
                logInfo({message: "Reconnected to websocket"})

                this._auth.authorize(this.sessionToken);
            })

        } catch (e) {
            console.error(e);
            throw new Error("Peer initialization failed due to missing dependencies.");
        }

    }

    public get sessionToken(): string {
        return this._sessionToken;
    }

    public static getInstance(peerState?: IPeerState): IPeer {
        if (!this._instance && !peerState) {
            throw new Error("Failed to initialize peer - no peer state")
        }
        if (!this._instance) {
            this._instance = new Peer(peerState)
        }
        return this._instance;
    }

    public onStatus = (fn: (data: string) => void): this => {
        this.on('status', fn)
        return this;
    }

    public onSessionInfo = (fn: (data: string) => void): this => {
        this.on('sessionInfo', fn)
        return this;
    }

    public onWebRTCMessage = (fn: (data: string) => void): this => {
        if (!this.listeners('webRTCMessage').includes(fn)) {
            this.on('webRTCMessage', fn);
        } else {
            logWarning({message: "Duplicate event listeners on webRTCMessage"})
        }
        return this;
    }

    public sendWebRTCMessage(message: string): void {
        this._rtcState.dataChannel.send(message)
    }

    private _setOwnStatus(status: EClientStatus): void {
        this._status = status;
        this.emit('status', this._status)
    }

    private _onMessage(data: string): void {
        this.emit('webRTCMessage', data)
    }

    private _emitSessionInfo(data: string): void {
        this.emit("sessionInfo", data);
    }

    private async _initClient(): Promise<void> {
        this._setOwnStatus(EClientStatus.Initialization);
        try {
            await this._auth.authorize(this._sessionToken);
            this._setOwnStatus(EClientStatus.Authorized);
        } catch (e) {
            this._setOwnStatus(EClientStatus.DisconnectedFail);
            throw e;
        }
        this._setOwnStatus(EClientStatus.Connected);
        this._handleMessage();
    }

    private _handleMessage(): void {
        this._appEvent.on('dataMessage', (data) => this._processMessage(data))
    }

    private async _processMessage(data: IIncomingMessage): Promise<void> {

        if (this._peerRole === PeerRole.Initiator && data.type === EWebSocketEventType.Connect) {

            this._setOwnStatus(EClientStatus.SendingOffer);
            await this._sendOffer();
            this._setOwnStatus(EClientStatus.WaitingForAnswer);

        } else if (this._peerRole === PeerRole.Joiner && data.type === EWebSocketEventType.Offer) {
            this._setOwnStatus(EClientStatus.SendingAnswer);
            await this._handleOffer(data);
            this._setOwnStatus(EClientStatus.WaitingForAnswerAccepted);

        } else if (data.answer) {
            await this._handleAnswer(data);
            this._setOwnStatus(EClientStatus.SessionEstabilished);
        } else if (data.type === EWebSocketEventType.Candidate && data.candidate) {
            await this._handleCandidate(data);
            this._setOwnStatus(EClientStatus.WebRTCInitialization);
        } else if (data.type === EWebSocketEventType.SessionInfo) {
            this._emitSessionInfo(data.payload);
        }
    }

    private async _sendOffer(): Promise<void> {
        this._rtcState.peerConnection = new RTCPeerConnection({iceServers: this.iceServers});

        this._rtcState.dataChannel = this._rtcState.peerConnection.createDataChannel("chat");

        const offer = await this._rtcState.peerConnection.createOffer();
        await this._rtcState.peerConnection.setLocalDescription(offer);

        const rtcOffer: IOutgoingMessage = {
            type: EWebSocketEventType.Offer,
            offer: offer,
            sessionToken: this._sessionToken,
            peerStatus: EClientStatus.WebRTCInitialization
        }

        this._appEvent.sendWSMessage(rtcOffer)
    }

    private _handleIceCandidate(event: RTCPeerConnectionIceEvent): void {
        if (event.candidate) {
            const iceCandidateMsg: IOutgoingMessage = {
                type: EWebSocketEventType.Candidate,
                candidate: event.candidate,
                sessionToken: this._sessionToken,
                peerStatus: EClientStatus.WebRTCInitialization
            };
            this._appEvent.sendWSMessage(iceCandidateMsg);
        }
    }

    private async _handleCandidate(data: IIncomingMessage): Promise<void> {
        if (this._rtcState.peerConnection && data.candidate) {
            try {
                await this._rtcState.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (error) {
                console.error("Error adding ICE candidate:", error);
            }
        }
    }

    private async _handleOffer(data: IIncomingMessage): Promise<void> {
        try {
            if (!this._rtcState.peerConnection) {
                this._rtcState.peerConnection = new RTCPeerConnection({iceServers: this.iceServers});
                this._rtcState.peerConnection.onicecandidate = (event) => this._handleIceCandidate(event);
            }
            this._setOwnStatus(EClientStatus.WebRTCInitialization);

            await this._rtcState.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer as RTCSessionDescriptionInit));

            const answer = await this._rtcState.peerConnection.createAnswer();
            await this._rtcState.peerConnection.setLocalDescription(answer);

            const answerMsg: IOutgoingMessage = {
                type: EWebSocketEventType.Answer,
                answer: answer,
                sessionToken: this._sessionToken,
                peerStatus: EClientStatus.WebRTCInitialization
            };
            this._appEvent.sendWSMessage(answerMsg);

            this._rtcState.peerConnection.ondatachannel = (event) => {
                this._rtcState.dataChannel = event.channel;
                this._setupDataChannel();
                this._setOwnStatus(EClientStatus.DataSignalling);
            };
        } catch (error) {
            this._setOwnStatus(EClientStatus.DisconnectedFail);
            console.error('Error setting remote description or creating answer:', error);
        }
    }

    private async _handleAnswer(message: IIncomingMessage): Promise<void> {
        try {
            await this._rtcState.peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer as RTCSessionDescriptionInit));

            this._rtcState.dataChannel!.onopen = () => {
                const openedMsg: IOutgoingMessage = {
                    type: EWebSocketEventType.PeerReady,
                    peerStatus: EClientStatus.WebRTCInitialization,
                    sessionToken: message.sessionToken
                };
                this._appEvent.sendWSMessage(openedMsg);
            };

            this._setupDataChannel();

            this._rtcState.peerConnection.onconnectionstatechange = () => {
                if (this._rtcState.peerConnection.connectionState === 'failed') {
                    logError({message: 'WebRTC connection failed - check ICE configuration.'});
                }
            };
        } catch (error) {
            logError({message: 'Error setting remote description:', error});
        }
    }

    private _sendInitializationWebRTCMessage(): void {
        const webRTCInitMessage: IInitialWebRTCMessage = {
            type: EWebSocketEventType.WebRTCInitializationMessage
        }
        this._rtcState.dataChannel.send(JSON.stringify(webRTCInitMessage))
    }

    private _handleInitializationWebRTCMessage(message: string): void {
        logInfo({message: 'WebRTC initalization message handled'})
        try {
            if (!message) {
                throw new Error("No message found")
            }
            const webRTCInitizalizationMessage: IInitialWebRTCMessage = JSON.parse(message);
            if (webRTCInitizalizationMessage.type === EWebSocketEventType.WebRTCInitializationMessage) {
                this._setOwnStatus(EClientStatus.PeersConnected)
            }
        } catch (e) {
            logError({message: e.message, error: e})
        }
    }

    private _setupDataChannel(): void {
        if (!this._rtcState.dataChannel) return;

        this._rtcState.dataChannel.onopen = () => {
            this._sendInitializationWebRTCMessage()
        };

        this._rtcState.dataChannel.onmessage = (event) => {
            this._handleInitializationWebRTCMessage(event.data)
            this._onMessage(event.data)
        };

        this._rtcState.dataChannel.onclose = () => {
            logInfo({message: "WebRTC Session was closed:" + this._sessionToken + " for peer: " + this._peerRole})
        };
    }
}

export const initializePeer = (peerState: IPeerState): IPeer => {
    try {
        return Peer.getInstance(peerState)
    } catch (e) {
        logError(e)
    }
}

export const getPeer = (): IPeer => {
    try {
        return Peer.getInstance()
    } catch (e) {
        logError(e)
    }
}

export const getOnPeerStatus = () => {
    try {
        return Peer.getInstance().onStatus;

    } catch (e) {
        throw logError(e)
    }
}

export const sendWebRTCMessage = (data: string): void => {
    Peer.getInstance().sendWebRTCMessage(data)
}

export const onMessage = (fn: (data: string) => void): void => {
    Peer.getInstance().onWebRTCMessage(fn)
}