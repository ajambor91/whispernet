import {WebRTCIceCandidate, WebRTCSessionDescription} from "./webrtc.interface";
import {EWebSocketEventType} from "../enums/ws-message.enum";
import {IPeerSession, ISession} from "./session.model";
import {EClientStatus} from "../enums/client-status.enum";
import {PeerRole} from "../enums/peer-role.enum";


interface IBaseMessage {
    type: EWebSocketEventType;
    sessionToken: string;
    candidate?: WebRTCIceCandidate;
    offer?: WebRTCSessionDescription;
    answer?: WebRTCSessionDescription;
    target?: string;
    from?: string;
    payload?: string;
    timestamp?: number;
    metadata?: any;
}
export interface IIncomingMessage extends IBaseMessage{

}

export interface IOutgoingMessage extends  IBaseMessage{
    peerRole?: PeerRole

}

export interface ITechnicalMessage {
    userToken: string;
}


export interface ISignalMessage extends Pick<IBaseMessage, 'type' | 'sessionToken'> {}

export interface IAuthMessage extends Pick<IBaseMessage, 'type' >, Partial<Pick<IBaseMessage, 'sessionToken'>> {}
