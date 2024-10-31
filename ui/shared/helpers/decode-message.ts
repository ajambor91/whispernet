import {WSMessage, WSSignalMessage} from "../models/ws-message.model";
import {IEventMessage} from "../models/event-message.model";


export const decodeMessage: (buffer: Buffer) => IEventMessage = (buffer: Buffer): IEventMessage => {
    if (!(buffer instanceof Buffer)) {
        throw new Error("No message found");
    }
    return parseForWSMsg(buffer.toString());
};
export const parseForWSMsg: (decodedMessage: string) => IEventMessage = (decodeMessage: string): IEventMessage => {
    return JSON.parse(decodeMessage);
}

export const formatMessageForWS: (message: WSMessage | WSSignalMessage) => Buffer = (message: WSMessage | WSSignalMessage) => {
    if (!message) {
        throw new Error("Message object is required to send.");
    }
    return Buffer.from(JSON.stringify(message));
};

