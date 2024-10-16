export interface WebRTCIceCandidate {
    candidate: string;
    sdpMid?: string;
    sdpMLineIndex?: number;
}

export interface WebRTCSessionDescription {
    type: 'offer' | 'answer';
    sdp: string;
}