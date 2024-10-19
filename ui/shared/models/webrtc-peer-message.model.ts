

type MessageType = 'incoming' | 'reply'
export interface WebrtcPeerMessage {
    content: string;
    messageId?: number;
    sessionId: string;
    type:MessageType
}