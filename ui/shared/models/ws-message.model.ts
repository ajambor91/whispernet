import {EWebSocketEventType} from "../enums/ws-message.enum";
import {EClientStatus} from "../enums/client-status.enum";

export interface ISession {
    sessionToken: string;
}

interface IBaseMessage {
    type: EWebSocketEventType;
    sessionToken: string;
    candidate?: RTCIceCandidate;
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    target?: string;
    from?: string;
    payload?: string;
    timestamp?: number;
    metadata?: any;
}

export interface IIncomingMessage extends IBaseMessage {

}


export interface IOutgoingMessage extends IBaseMessage {
    peerStatus: EClientStatus;
}

export interface IGoodMorningMessage extends Pick<IBaseMessage, 'type'> {
}

export interface IGoodByeMessage extends Pick<IBaseMessage, 'type'> {
}

export interface ISignalMessage extends Pick<IBaseMessage, 'type' | 'session'> {
}

export interface IAuthMessage extends Pick<IBaseMessage, 'type'>, Partial<Pick<IBaseMessage, 'session'>> {
}

export interface IInitialWebRTCMessage extends Pick<IBaseMessage, 'type'> {
}