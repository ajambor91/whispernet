export enum WsMessageEnum {
    Offer = 'offer',
    IncommingOffer = 'incomming_offer',
    Answer = 'answer',
    Candidate = 'candidate',
    Waiting = 'waiting',
    Found = 'found',
    Init = 'init',
    InitAccepted = 'init-accepted',
    Join = 'join',
    ICERequest = 'ice-request',
    ICEResponse = 'ice',
    ICEAccepted = 'ice-accepted',
    RoleRequest = 'role-request',
    RoleAccepted = 'role-accepted',
    RoleResponse = 'role-response',
    PrepareRTC = 'prepare-rtc',
    Ready = 'ready',
    Start = 'start',
    Connect = 'connect',
    Connected = 'connected',
    PeerReady = 'peer-ready',
    PeerJoin = 'peer-join',
    Listen = 'listen',
    MsgReceived = 'msg-received'


}
