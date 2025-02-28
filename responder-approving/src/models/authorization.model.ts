import {IApprovingMessageWs} from "./approving-message-ws.model";

export interface IAuthorization extends Pick<IApprovingMessageWs, "sessionToken"> {
    userToken: string;
}