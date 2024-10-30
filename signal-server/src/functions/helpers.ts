import {WSMessage, WSSignalMessage} from "../models/ws-message.model";
import {IClient} from "../models/client.model";


export const decodeMessage: (buffer: Buffer) => WSMessage | WSSignalMessage = (buffer: Buffer): WSMessage | WSSignalMessage => {
    if (!(buffer instanceof Buffer)) {
        throw new Error("No message found");
    }
    return parseForWSMsg(buffer.toString());
};
export const parseForWSMsg: (decodedMessage: string) => WSMessage = (decodeMessage:string): WSMessage => {
    return JSON.parse(decodeMessage);
}

export const formatMessageForWS: (message: WSMessage | WSSignalMessage) => Buffer = (message: WSMessage | WSSignalMessage) => {
    if (!message) {
        throw new Error("Message object is required to send.");
    }
    return Buffer.from(JSON.stringify(message));
};

