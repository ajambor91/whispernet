import {
    IAuthMessage, IGoodByeMessage, IGoodMorningMessage,
    IIncomingMessage,
    IOutgoingMessage,
    ISignalMessage
} from "./ws-message.model";

export interface IEventMessage {
    event: string;
    data: IIncomingMessage | IOutgoingMessage | IAuthMessage | ISignalMessage | IGoodMorningMessage | IGoodByeMessage
}