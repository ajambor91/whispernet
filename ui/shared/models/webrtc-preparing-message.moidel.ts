type MessageType = 'incoming' | 'reply'

export interface IWebrtcLocalMessage {
    content: string;
    messageId?: number;
    sessionId?: string;
    type?: MessageType
}