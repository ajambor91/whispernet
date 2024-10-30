import {ClientStatus} from "../enums/client-status.model";
import {WsMessageEnum} from "../enums/ws-message.enum";
import {PeerRole} from "../enums/peer-role.enum";

interface Session {
    sessionToken: string;
}
export interface WSMessage {
    msgType: 'peer' | 'signal';
    type: WsMessageEnum;
    peerStatus: ClientStatus;
    remotePeerStatus: ClientStatus;
    session: Session;
    candidate?: RTCIceCandidate;
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    target?: string;
    from?: string;
    payload?: string;
    timestamp?: number;
    metadata?: any;
}

export interface WSSignalMessage extends Pick<WSMessage, 'type' | 'session' | 'msgType'> {}