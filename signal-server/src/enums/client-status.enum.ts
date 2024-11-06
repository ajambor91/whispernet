export enum EClientStatus {
    NotConnected = 'not-connected',
    Initializating = 'init',
    WaitingForPeer = 'waiting-for-peer',
    Connected = 'connected',
    DataSignalling = 'data-signalliing',
    WebRTCInitialization = 'webrtc-initialization',
    DisconnectedFail = 'disconnected-fail',
}