import {IAuthMessage, ISession} from "../models/ws-message.model";

export interface IAuth {
    authorize: (session: ISession) => Promise<void>
}