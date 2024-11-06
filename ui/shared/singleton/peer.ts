import {EventEmitter} from "events";
import {AppEvent} from "./app-event.singleton";
import {EClientStatus} from "../enums/client-status.model";
import {IAuth} from "../interfaces/auth.interface";
import {getAuth} from "./auth.singleton";
import {IPingPong} from "../interfaces/ping-pong.interface";
import {getPingPong} from "./ping-pong.singleton";
import {IIncomingMessage, IOutgoingMessage, ISession} from "../models/ws-message.model";
import {ConnectionStateModel} from "../models/connection-state.model";
import {PeerRole} from "../enums/peer-role.enum";
import {EWebSocketEventType} from "../enums/ws-message.enum";
import {IPeerState} from "../slices/createSession.slice";

export class Peer extends EventEmitter {
    private readonly _auth: IAuth = getAuth();
    private readonly _ping: IPingPong = getPingPong();
    private readonly _appEvent: AppEvent = AppEvent.getInstance();
    private readonly _session: ISession;
    private readonly _peerRole: PeerRole;
    private _status: EClientStatus = EClientStatus.NotConnected;
    private _rtcState!: ConnectionStateModel;
    private iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];

    constructor(peerState: IPeerState) {
        super();
        this._session = peerState.session;
        this._peerRole = peerState.peerRole
        this._rtcState = {
            dataChannel: null,
            peerConnection: null,
            role: null,
            userId: null,
            stage: null
        }
        this._initClient();
    }

    public onStatus = (fn: (data: string) => void): this => {
        this.on('status', fn)
        return this;
    }

    private _setOwnStatus(status: EClientStatus): void {
        this.emit('status', status)
    }

    private async _initClient(): Promise<void> {
        console.log('#### INIT CLIENT')
        await this._auth.authorize(this._session)
        this._setOwnStatus(EClientStatus.Connected)
        // this._sendInitMessage();
        this._handleMessage();
    }

    // private _sendInitMessage(): void {
    //     this._appEvent.sendInitialMessage();
    // }

    private _handleMessage(): void {
        this._appEvent.on('dataMessage', (data) => this._processMessage(data))
    }

    private async _processMessage(data: IIncomingMessage): void {
        console.log("PEER DATA", data.type, this._peerRole)
        if (this._peerRole === PeerRole.Initiator && data.type === EWebSocketEventType.Connect) {
            await this._sendOffer()
            this._setOwnStatus(EClientStatus.WebRTCInitialization)

        } else if (this._peerRole === PeerRole.Joiner && data.type === EWebSocketEventType.Offer) {
            await this._handleOffer(data);
            this._setOwnStatus(EClientStatus.DataSignalling)

        } else if (data.answer) {
            this._handleAnswer(data)
        }    else if (data.type === EWebSocketEventType.Candidate && data.candidate) {
            await this._handleCandidate(data);
            this._setOwnStatus(EClientStatus.Init)

        }

    }

    private async _sendOffer(): Promise<void> {
        this._rtcState.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });

        this._rtcState.dataChannel = this._rtcState.peerConnection.createDataChannel("chat");
        // if (this._rtcState.role === PeerRole.Initiator) {

            const offer = await this._rtcState.peerConnection.createOffer();
            await this._rtcState.peerConnection.setLocalDescription(offer);

            const rtcOffer: IOutgoingMessage = {
                type: EWebSocketEventType.Offer,
                offer: offer,
                session: this._session,
                peerStatus: EClientStatus.WebRTCInitialization
            }

            this._appEvent.sendWSMessage(rtcOffer)
            // }
    }

// Aktualizacja _handleIceCandidate, aby działała tylko z RTCPeerConnectionIceEvent
    private _handleIceCandidate(event: RTCPeerConnectionIceEvent): void {
        if (event.candidate) {
            const iceCandidateMsg: IOutgoingMessage = {
                type: EWebSocketEventType.Candidate,
                candidate: event.candidate,  // Konwertujemy na JSON, aby zachować struktury WebSocket
                session: this._session,
                peerStatus: EClientStatus.WebRTCInitialization
            };
            this._appEvent.sendWSMessage(iceCandidateMsg);
        }
    }

// Nowa implementacja _handleCandidate, aby akceptowała RTCIceCandidateInit
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
                this._rtcState.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });
                this._rtcState.peerConnection.onicecandidate = (event) => this._handleIceCandidate(event);
            }

            console.log("HANDLE OFFER AFTER CREATED RTC");

            // Ustawiamy zdalny opis z otrzymanej oferty
            await this._rtcState.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer as RTCSessionDescriptionInit));

            // Tworzymy odpowiedź (Answer) i ustawiamy ją jako lokalny opis
            const answer = await this._rtcState.peerConnection.createAnswer();
            await this._rtcState.peerConnection.setLocalDescription(answer);

            // Wysyłamy odpowiedź do inicjatora
            const answerMsg: IOutgoingMessage = {
                type: EWebSocketEventType.Answer,
                answer: answer,
                session: this._session,
                peerStatus: EClientStatus.WebRTCInitialization
            };
            this._appEvent.sendWSMessage(answerMsg);

            // Obsługujemy otwarcie kanału danych
            this._rtcState.peerConnection.ondatachannel = (event) => {
                this._rtcState.dataChannel = event.channel;
                this._setupDataChannel();
            };

        } catch (error) {
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
                    session: message.session
                };
                this._appEvent.sendWSMessage(openedMsg);
            };

            // Obsługujemy otwarcie kanału danych i nasłuchujemy wiadomości
            this._setupDataChannel();

            this._rtcState.peerConnection.onconnectionstatechange = () => {
                if (this._rtcState.peerConnection.connectionState === 'failed') {
                    console.error('WebRTC connection failed - check ICE configuration.');
                }
            };
        } catch (error) {
            console.error('Error setting remote description:', error);
        }
    }

// Ustawia nasłuchiwanie na kanał danych i wysyła wiadomość po otwarciu kanału
    private _setupDataChannel(): void {
        if (!this._rtcState.dataChannel) return;

        this._rtcState.dataChannel.onopen = () => {
            console.log('Data channel is open');
            this._rtcState.dataChannel.send('Hello Peer!');
        };

        this._rtcState.dataChannel.onmessage = (event) => {
            console.log('Received message:', event.data);
        };

        this._rtcState.dataChannel.onclose = () => {
            console.log('Data channel closed');
        };
    }


}

