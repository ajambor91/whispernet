import {WebRTCIceCandidate, WebRTCSessionDescription} from "./webrtc.interface";
import {WebRTCMessageEnum} from "../enums/webrtc-message-enum";

export interface WebRTCMessage {
    type: WebRTCMessageEnum;
    sessionId: string;
    candidate?: WebRTCIceCandidate;
    offer?: WebRTCSessionDescription;
    answer?: WebRTCSessionDescription;
    target: string;
    from?: string;
    payload?: string;
    timestamp?: number;
    metadata?: any;
}