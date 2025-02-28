import {EWsApprovingMsgType} from "../enums/ws-approving-msg-type.enum";

export interface IApprovingMessageWs {
    sessionToken: string;
    type: EWsApprovingMsgType;
}