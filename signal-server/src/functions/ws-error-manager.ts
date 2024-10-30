import {WsConnectionError} from "../enums/wsconnection-error.enum";
import {WSMessage} from "../models/ws-message.model";

import {SenderReceiver} from "../models/sender-receiver.model";
import {getSessionManager} from "../managers/session-manager";


const createWebRTCErr = () => {}
export const wsErrorManager = (error: WsConnectionError, msg: WSMessage, senderReceiver: SenderReceiver): void => {

}

export const renewRequest = () => {
    getSessionManager
}