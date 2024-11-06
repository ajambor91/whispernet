import {
    IAuthMessage,
    IIncomingMessage, IInitialMessage,
    IOutgoingMessage,
    ISignalMessage
} from "./ws-message.model";

export interface IEventMessage {
    event: string;
    data: IIncomingMessage | IOutgoingMessage | IAuthMessage | ISignalMessage | IInitialMessage
}