import {WSMessage} from "../models/ws-message.model";

export interface IAuth {
    authorize: (message: WSMessage) => void
}