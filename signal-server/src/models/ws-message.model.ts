import {WebRTCIceCandidate, WebRTCSessionDescription} from "./webrtc.interface";
import {WsMessageEnum} from "../enums/ws-message.enum";
import {Session} from "./session.model";
import {ClientStatus} from "../enums/client-status.enum";
import {PeerRole} from "../enums/peer-role.enum";

export interface WSMessage {
    type: WsMessageEnum;
    peerStatus: ClientStatus;
    remotePeerStatus: ClientStatus;
    session: Session;
    candidate?: WebRTCIceCandidate;
    offer?: WebRTCSessionDescription;
    answer?: WebRTCSessionDescription;
    target?: string;
    from?: string;
    payload?: string;
    timestamp?: number;
    metadata?: any;
}