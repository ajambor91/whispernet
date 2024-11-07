import {IncomingMessage} from "http";
import {IOutgoingMessage} from "./ws-message.model";
import {EInternalMessageType} from "../enums/internal-message-type.enum";

export interface IInternalMessage {
    status: EInternalMessageType;
    clientMessage?: IncomingMessage | IOutgoingMessage;
}