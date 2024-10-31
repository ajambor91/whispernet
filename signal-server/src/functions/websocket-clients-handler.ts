import WebSocket from "ws";
import { IncomingMessage } from "http";
import { getCookie } from "./check-client";
import console from "console";
import { getSessionManager, SessionManager} from "../managers/session-manager";
import { SessionController} from "../classes/session.controller";

import {AppEvent} from "../classes/base-event.class";
import {AuthController} from "../classes/auth.controller";

export const websocketClientsHandler: (ws: WebSocket, req: IncomingMessage) => void = (ws: WebSocket, req: IncomingMessage): void => {
    const sessionManager: SessionManager = getSessionManager;
    const userToken: string = getCookie(req);

    if (!userToken) {
        console.error("Invalid user token");
        ws.close();
        return;
    }

    const appEvent: AppEvent = new AppEvent(ws);

    appEvent.once('auth', (data) => {
        try {
            const authController: AuthController = new AuthController(userToken, appEvent, data);
            authController.authorize();

            const sessionToken: string = data.session.sessionToken;
            const currentSession: SessionController | undefined = sessionManager.getSession(sessionToken);

            if (!currentSession) {
                throw new Error("No session found");
            }

            currentSession.initNewConnection(userToken, appEvent);
            currentSession.processMessage(data);

            appEvent.on('dataMessage', (data) => {
                console.log('DATA MESSAGE', data)
                currentSession.processMessage(data);
            });

            ws.on('close', () => {
                console.log("Connection closed for:", userToken);
            });

            ws.on('error', (error) => {
                console.error("Web socket error:", error);
            });
        } catch (e) {
            console.error("Authorization error:", e);
            appEvent.sendUnauthorizewMessage();
            ws.close();
        }
    });
};
