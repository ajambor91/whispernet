export enum EClientStatus {
    NotConnected = 'not-connected',
    Initialization = 'init',
    Authorized = 'authorized',
    Connected = 'connected',
    SendingOffer = 'sending-offer',
    WaitingForAnswer = 'waiting-for-answer',
    SendingAnswer = 'sending-answer',
    WaitingForAnswerAccepted = 'waiting-for-answer-accecpted',
    SessionEstabilished = 'session-estabilished',
    DataSignalling = 'data-signalliing',
    WebRTCInitialization = 'webrtc-initialization',
    DisconnectedFail = 'disconnected-fail',
    PeersConnected = 'peers-connected'
}
