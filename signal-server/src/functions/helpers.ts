import {IEventMessage} from "../models/event-message.model";
import {IAuthMessage, IIncomingMessage, ISignalMessage} from "../models/ws-message.model";
import {IncomingMessage} from "http";


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

export const getCookie: (req: IncomingMessage) => string = (req: IncomingMessage): string => {
    if (!req.headers?.cookie) {
        throw new Error("No user token cookie found!");
    }
    const regexp: RegExp = /sessionToken=([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i;
    const cookie: string = req.headers.cookie;
    const result: RegExpMatchArray | null = cookie.match(regexp);
    let token: string;
    if (result && result[1]) {
        token = result[1]
    } else {
        throw new Error('No token found')
    }
    return token;
};