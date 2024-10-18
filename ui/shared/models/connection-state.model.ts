export interface ConnectionStateModel {
    peerConnection: RTCPeerConnection | null,
    dataChannel: RTCDataChannel | null
}