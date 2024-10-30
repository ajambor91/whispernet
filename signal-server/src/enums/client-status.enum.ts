export enum EClientStatus {
    Init = 'init',
    SessionTokenCreated = 'session-token-created',
    DisconnectedFail = 'disconnected-fail',
    NotConnected = 'not-connected',
    Connected = 'connected',
    WaitingForPeer = 'waiting-for-peer',
    Waiting = 'waiting',
    Prepare = 'prepare',
    Ready = 'ready',
    Set = 'set',
    Unknown = 'unknown'
}