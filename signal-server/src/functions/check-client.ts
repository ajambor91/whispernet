import {IncomingMessage} from "http";
import console from "console";
import {Client} from "../models/client.model";
import * as buffer from "buffer";



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


export const decodeMessage: (buffer: Buffer) => string = (buffer: Buffer): string => {
    if (!(buffer instanceof Buffer)) {
        throw new Error("No message found");
    }
    return buffer.toString();
};

export const compareTokens = (clients: Client[], userToken: string) => {
    const isAuthorized: boolean = clients.some(client => client.userToken === userToken);
    if (!isAuthorized) {
        throw new Error("Client not authorized, userToken: " + userToken)
    }
    return true;

}
