import {WsConnectionError} from "../enums/wsconnection-error.enum";

import {SenderReceiver} from "../models/sender-receiver.model";
import {getSessionManager} from "../managers/session-manager";
import {IIncomingMessage} from "../models/ws-message.model";


const createWebRTCErr = () => {}
export const wsErrorManager = (error: WsConnectionError, msg: IIncomingMessage, senderReceiver: SenderReceiver): void => {

}

export const renewRequest = () => {
    getSessionManager
}