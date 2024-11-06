import {IncomingMessage} from "http";
import {IOutgoingMessage} from "./ws-message.model";

export interface IInternalMessage {
    status: 'added' | 'join' | 'data';
    clientMessage?: IncomingMessage | IOutgoingMessage;
}