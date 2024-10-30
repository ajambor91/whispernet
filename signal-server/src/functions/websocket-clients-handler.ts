import WebSocket from "ws";
import { IncomingMessage } from "http";
import { getCookie } from "./check-client";
import console from "console";
import { getSessionManager, SessionManager, sessionMap} from "../managers/session-manager";
import { SessionController} from "../classes/session.controller";
import {WSMessage} from "../models/ws-message.model";
import {decodeMessage, parseForWSMsg} from "./helpers";

export const websocketClientsHandler: (ws: WebSocket, req: IncomingMessage) => void = (ws: WebSocket, req: IncomingMessage): void => {
    const sessionManager: SessionManager = getSessionManager;
    console.log("SESSION MANAGER", sessionManager.getSessions())
    const userToken: string = getCookie(req);
    ws.once('message', (buffer: Buffer) => {
        try {
            const wsMsg: WSMessage = decodeMessage(buffer) as WSMessage;
            const sessionToken: string = wsMsg.session.sessionToken;
            console.log("sessionToken", sessionToken)
            const currentSession: SessionController | undefined = sessionManager.getSession(sessionToken);
            if (!currentSession) {
                throw new Error("No session found")
            }
            currentSession.initNewConnection(userToken, ws);
            currentSession.processMessage(wsMsg);
            ws.on('message', (buffer: Buffer) => {
                const wsMsg: WSMessage = decodeMessage(buffer) as WSMessage;
                currentSession.processMessage(wsMsg);
            })
        } catch (e) {
            console.error(e);
        }
    });
};