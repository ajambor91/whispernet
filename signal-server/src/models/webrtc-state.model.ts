import {WebRTCIceCandidate, WebRTCSessionDescription} from "./webrtc.interface";

export interface ConnectionState {
    stage: ConnectionStage;
    offer: WebRTCSessionDescription | null;
    answer: WebRTCSessionDescription | null;
    iceCandidates: WebRTCIceCandidate[];
}

export enum ConnectionStage {
    WaitingForPeer,
    Connect,
    PeerReady,
    MsgReceived,
    Listen,
    Candidate,
    Answer,
    Start,
    InitAccepted,
    ICERequest,
    ICEAccepted,
    RoleRequest,
    RoleAccepted,
    Offer
}


