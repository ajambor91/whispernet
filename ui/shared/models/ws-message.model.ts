import {EWebSocketEventType} from "../enums/ws-message.enum";
import {EClientStatus} from "../enums/client-status.model";

export interface ISession {
    sessionToken: string;
}

interface IBaseMessage {
    type: EWebSocketEventType;
    session: ISession;
    candidate?: RTCIceCandidate;
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    target?: string;
    from?: string;
    payload?: string;
    timestamp?: number;
    metadata?: any;
}
export interface IIncomingMessage extends IBaseMessage{

}


export interface IOutgoingMessage extends  IBaseMessage{
    peerStatus: EClientStatus;
}

export interface IInitialMessage extends Pick<IBaseMessage, 'type'> {}
export interface ISignalMessage extends Pick<IBaseMessage, 'type' | 'session'> {}

export interface IAuthMessage extends Pick<IBaseMessage, 'type' >, Partial<Pick<IBaseMessage, 'session'>> {}