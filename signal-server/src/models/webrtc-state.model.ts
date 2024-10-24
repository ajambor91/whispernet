import {WebRTCIceCandidate, WebRTCSessionDescription} from "./webrtc.interface";

export interface WebrtcState {
    stage: 'answer' | 'offer' | 'ice' | null;
    offer: WebRTCSessionDescription | null;
    answer: WebRTCSessionDescription | null;
    iceCandidates: WebRTCIceCandidate[];
}