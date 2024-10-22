import { Client } from "../models/client.model";
import WebSocket from "ws";
import { IncomingMessage } from "http";
import { getCookie } from "./check-client";
import { decodeMessage } from "./decode-binary-message";
import console from "console";
import {createSessionManager, sessionMap} from "./session-manager";
import {messageManager} from "./message-manager";
import {WSMessage} from "../models/ws-message.model";
import {parseForWSMsg} from "./helpers";

export const websocketClientsHandler: (ws: WebSocket, req: IncomingMessage) => void = (ws: WebSocket, req: IncomingMessage): void => {
    ws.on('message', (buffer: Buffer) => {
        try {
            const rawMessage: string = decodeMessage(buffer);
            const wsMsg: WSMessage = parseForWSMsg(rawMessage);
            const sessionToken: string = wsMsg.session.sessionToken;
            console.log('sessionToken', sessionToken)
            let sessionManager = sessionMap.get(sessionToken);
            if (!sessionManager) {
                sessionManager = createSessionManager();
                sessionMap.set(sessionToken, sessionManager);
            }
            const userToken: string = getCookie(req);
            let client: Client = sessionManager.getClient(userToken)

            if (client) {
                client = { conn: ws, ...client };
                sessionManager.setClient(client);
                messageManager(wsMsg,userToken )

            } else {
                throw new Error("Client not authorized");
            }
        } catch (e) {
            console.error(e);
        }
    });
};