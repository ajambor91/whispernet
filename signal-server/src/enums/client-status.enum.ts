export enum ClientStatus {
    Init = 'init',
    SessionTokenCreated = 'session-token-created',
    NotConnected = 'not-connected',
    Connected = 'connected',
    WaitingForPeer = 'waiting-for-peer',
    Waiting = 'waiting',
    Prepare = 'prepare',
    Ready = 'ready',
    Set = 'set'
}