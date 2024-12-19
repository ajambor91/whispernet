import {IAuthMessage, ISession} from "../models/ws-message.model";

export interface IAuth {
    authorize: (sessionToken: string) => Promise<void>
}