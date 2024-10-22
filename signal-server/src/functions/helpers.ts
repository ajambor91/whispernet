import { WSMessage} from "../models/ws-message.model";

export const parseForWSMsg: (decodedMessage: string) => WSMessage = (decodeMessage:string): WSMessage => {
    return JSON.parse(decodeMessage);
}

export const createStringWSMsg: (message: WSMessage) => string = (message: WSMessage) => {
    if (!message) {
        throw new Error("No message to send");
    }
    return JSON.stringify(message);
}

