type MessageType = 'incoming' | 'reply'

export interface IWebrtcPeerMessage {
    content: string;
    messageId?: number;
    sessionId?: string;
    type?: MessageType
}