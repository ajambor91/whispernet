import {IncomingMessage} from "http";
import {IApprovingMessageWs} from "../models/approving-message-ws.model";

export const getCookie: (req: IncomingMessage) => string = (req: IncomingMessage): string => {
    if (!req.headers?.cookie) {
        throw new Error("No user token cookie found!");
    }
    const regexp: RegExp = /userToken=([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i;
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

export const parseMessage: (msg: string | Buffer) => IApprovingMessageWs = (msg: string | Buffer): IApprovingMessageWs => {
    let stringMessage: string | undefined = undefined;
    if (msg instanceof Buffer) {
        stringMessage = msg.toString();
    } else if (typeof msg === 'string') {
        stringMessage = msg;
    }


    return !!stringMessage ? JSON.parse(stringMessage) : null;
}