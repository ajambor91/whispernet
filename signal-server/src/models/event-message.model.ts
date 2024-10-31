import {WSAuthMessage, WSMessage, WSSignalMessage} from "./ws-message.model";

export interface IEventMessage {
    event: string;
    data: WSMessage | WSSignalMessage | WSAuthMessage;
}