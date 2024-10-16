import {WebRTCMessageEnum} from "../enums/webrtc-message-enum";

interface WebRTCMessage {
    type: WebRTCMessageEnum;
    sessionId: string;
    candidate?: RTCIceCandidate;
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    target: string;
    from?: string;
    payload?: string;
    timestamp?: number;
    metadata?: any;
}