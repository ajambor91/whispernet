export interface WebRTCIceCandidate {
    candidate: string;
    sdpMid?: string;
    sdpMLineIndex?: number;
    unique?: string;
    usernameFragment?: string;
}

export interface WebRTCSessionDescription {
    type: 'offer' | 'answer';
    sdp: string;
}