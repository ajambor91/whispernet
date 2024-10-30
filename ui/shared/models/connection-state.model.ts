import {PeerRole} from "../enums/peer-role.enum";

export interface ConnectionStateModel {
    peerConnection: RTCPeerConnection | null;
    dataChannel: RTCDataChannel | null;
    role: PeerRole | null;
    userId: string | null;
    stage: string | null;
}