import {IncomingMessage} from "http";




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

