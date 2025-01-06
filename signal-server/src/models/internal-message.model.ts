import {IncomingMessage} from "http";
import {IIncomingMessage, IOutgoingMessage, ITechnicalMessage} from "./ws-message.model";
import {EInternalMessageType} from "../enums/internal-message-type.enum";

export interface IInternalMessage {
    status: EInternalMessageType;
    clientMessage?: IIncomingMessage | IOutgoingMessage;
}