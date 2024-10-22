import {PeerRole} from "../enums/peer-role.enum";

export interface ConnectionStateModel {
    peerConnection: RTCPeerConnection | null;
    dataChannel: RTCDataChannel | null;
    role: PeerRole | null;
}