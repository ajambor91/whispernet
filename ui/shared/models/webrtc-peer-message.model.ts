type MessageType = 'incoming' | 'reply'

export interface IWebrtcPeerMessage {
    encryptedMsg: string;
    iv: string;
    messageId?: number;
    sessionId?: string;
    type?: MessageType
}