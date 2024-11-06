export enum EClientStatus {
    NotConnected = 'not-connected',
    Init = 'init',
    WaitingForPeer = 'waiting-for-peer',
    Connected = 'connected',
    DataSignalling = 'data-signalliing',
    WebRTCInitialization = 'webrtc-initialization',
    DisconnectedFail = 'disconnected-fail',
}
