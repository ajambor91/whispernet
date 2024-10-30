import {WebRTCIceCandidate, WebRTCSessionDescription} from "./webrtc.interface";
import {EWebSocketEventType} from "../enums/ws-message.enum";
import {ISession} from "./session.model";
import {EClientStatus} from "../enums/client-status.enum";
import {PeerRole} from "../enums/peer-role.enum";

export interface WSMessage {
    msgType: 'peer' | 'signal';
    type: EWebSocketEventType;
    peerStatus: EClientStatus;
    remotePeerStatus: EClientStatus;
    session: ISession;
    candidate?: WebRTCIceCandidate;
    offer?: WebRTCSessionDescription;
    answer?: WebRTCSessionDescription;
    target?: string;
    from?: string;
    payload?: string;
    timestamp?: number;
    metadata?: any;
}

export interface WSSignalMessage extends Pick<WSMessage, 'type' | 'session' | 'msgType'> {}