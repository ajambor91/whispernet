import {IAuthMessageWS} from "./auth-message-ws.model";

export interface IAuthorization extends IAuthMessageWS {
    userToken: string;
}