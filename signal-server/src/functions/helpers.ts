import { WSMessage} from "../models/ws-message.model";
import {Client} from "../models/client.model";

export const parseForWSMsg: (decodedMessage: string) => WSMessage = (decodeMessage:string): WSMessage => {
    return JSON.parse(decodeMessage);
}

export const createStringWSMsg: (message: WSMessage) => string = (message: WSMessage) => {
    if (!message) {
        throw new Error("No message to send");
    }
    return JSON.stringify(message);
}

export const sendMessage = (msg: WSMessage, clients: Client[]) => {
    clients.forEach(conn => conn.conn?.send(Buffer.from(createStringWSMsg(msg))));
}