import {IEventMessage} from "../models/event-message.model";
import {IAuthMessage, IIncomingMessage, ISignalMessage} from "../models/ws-message.model";


export const decodeMessage: (buffer: Buffer) => IEventMessage = (buffer: Buffer): IEventMessage => {
    if (!(buffer instanceof Buffer)) {
        throw new Error("No message found");
    }
    return parseForWSMsg(buffer.toString());
};
export const parseForWSMsg: (decodedMessage: string) => IEventMessage = (decodeMessage:string): IEventMessage => {
    return JSON.parse(decodeMessage);
}

export const formatMessageForWS: (message: IIncomingMessage | ISignalMessage | IAuthMessage) => Buffer = (message: IIncomingMessage | ISignalMessage | IAuthMessage) => {
    if (!message) {
        throw new Error("Message object is required to send.");
    }
    return Buffer.from(JSON.stringify(message));
};

