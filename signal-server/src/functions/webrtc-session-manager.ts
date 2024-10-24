import {WebRTCIceCandidate, WebRTCSessionDescription} from "../models/webrtc.interface";
import {WebrtcState} from "../models/webrtc-state.model";


export type WebRTCSessionManager = {
    getOffer: () => WebRTCSessionDescription | null,
    setOffer: (offer: WebRTCSessionDescription) => void,
    getAnswer: () => WebRTCSessionDescription | null,
    setAnswer: (answer: WebRTCSessionDescription) => void,
    setIceCandidates: (iceCandidates: WebRTCIceCandidate[]) => void,
    getIceCandidates: () => WebRTCIceCandidate[],
    addIceCandidate: (iceCandidate: WebRTCIceCandidate) => void,
    getStage: () => 'answer' | 'offer' | 'ice' | null
}
export const webRTCSessionMap: Map<string, WebRTCSessionManager> = new Map();

export const createWebRTCSessionManager = (): WebRTCSessionManager => {
    let webRTCState: WebrtcState  = {
        offer: null,
        answer: null,
        iceCandidates: [],
        stage: null
    };

    return {
        addIceCandidate: (iceCandidate: WebRTCIceCandidate): void => {
            webRTCState.iceCandidates.push(iceCandidate);
        },
        setIceCandidates: (iceCandidates: WebRTCIceCandidate[]): void => {
            webRTCState.iceCandidates.push(...iceCandidates);
        },
        getIceCandidates: () => webRTCState.iceCandidates,
        setAnswer: (answer: WebRTCSessionDescription) => {
            webRTCState.answer = answer;
            webRTCState.stage = 'answer';
        },
        getAnswer: () => webRTCState.answer,
        setOffer: (offer: WebRTCSessionDescription) => {
            webRTCState.offer = offer;
            webRTCState.stage = 'offer';
        },
        getOffer: () => webRTCState.offer,
        getStage: () => webRTCState.stage
    };
};