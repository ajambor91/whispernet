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
            iceCandidate.unique = iceCandidate.usernameFragment + iceCandidate.sdpMid + iceCandidate.sdpMLineIndex;
            const isExists: boolean = webRTCState.iceCandidates.some(existingCandidate => existingCandidate.unique = iceCandidate.unique);
            if (isExists) {
                webRTCState.iceCandidates.push(iceCandidate);
            }
        },
        setIceCandidates: (iceCandidates: WebRTCIceCandidate[]): void => {

            const uniqueCandidates = new Set<string>();

            const candidatesToSet = iceCandidates.filter(curr => {
                const unique = curr.usernameFragment + curr.sdpMid + curr.sdpMLineIndex;
                if (!uniqueCandidates.has(unique)) {
                    uniqueCandidates.add(unique);
                    return true;
                }
                return false;
            });
            webRTCState.iceCandidates.push(...candidatesToSet);
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

export const getWebRTCSessionManager = (session: string): WebRTCSessionManager => {
    let manager: WebRTCSessionManager | undefined = webRTCSessionMap.get(session);
    if (!manager) {
        manager = createWebRTCSessionManager();
        webRTCSessionMap.set(session, manager)
    }
    return manager;
}