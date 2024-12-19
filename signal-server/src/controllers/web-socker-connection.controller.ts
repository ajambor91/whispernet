import WebSocket from "ws";
import { IncomingMessage } from "http";
import { getSessionManager, SessionManager } from "../managers/session-manager";
import { AppEvent } from "../classes/app-event";
import { AuthController } from "./auth.controller";
import { SessionController } from "./session-controller";
import { Peer } from "../classes/peer";
import { getCookie } from "../functions/helpers";
import { logWarning, logError, logInfo } from "../error-logger/error-looger";

export class WebSocketConnectionController {
    private ws: WebSocket;
    private req: IncomingMessage;
    private sessionManager: SessionManager;
    private isAuthorized: boolean = false;
    private userToken: string;
    private appEvent: AppEvent;
    private currentPeer!: Peer;
    private currentSession!: SessionController;
    private sessionToken!: string;

    constructor(ws: WebSocket, req: IncomingMessage) {
        this.ws = ws;
        this.req = req;
        this.sessionManager = getSessionManager;
        this.userToken = getCookie(req);
        this.appEvent = new AppEvent(ws);

        if (!this.userToken) {
            logError({ event: "InvalidUserToken", message: "Invalid user token, closing connection" });
            this.ws.close();
            return;
        }

        logInfo({ event: "WebSocketConnection", message: "New WebSocket connection", userToken: this.userToken });
        this.initialize();
    }

    private initialize(): void {
        logInfo({ event: "InitializeWebSocket", message: "Initializing WebSocket connection", userToken: this.userToken });
        this.appEvent.once('auth', (data) => this.handleAuth(data));
        this.ws.on('close', () => this.handleClose());
        this.ws.on('error', (error) => this.handleError(error));
        this.appEvent.once('goodMorning', () => this.handleGoodMorningMessage());
        this.appEvent.once('goodBye', () => this.handleGoodByeMessage())
    }

    private handleAuth(data: any): void {
        try {
            const sessionToken: string = data.sessionToken;
            const currentSession: SessionController | undefined = this.sessionManager.getSession(sessionToken);

            if (!currentSession) {
                throw new Error("No session found");
            }
            const currentPeer: Peer | undefined = currentSession.getUser(this.userToken);

            if (!currentPeer) {
                throw new Error("No peer found");
            }

            const authController: AuthController = new AuthController(this.userToken, currentPeer, data, this.appEvent);
            authController.authorize();

            this.isAuthorized = true;
            this.currentPeer = currentPeer;
            this.currentSession = currentSession;

            logInfo({ event: "HandleAuth", message: "User authorized", userToken: this.userToken });

            this.appEvent.on('dataMessage', (data) => {
                logInfo({ event: "DataMessageReceived", message: "Data message received", userToken: this.userToken, data });
            });
        } catch (e) {
            logError({ event: "AuthorizationError", message: "Authorization error", error: e, userToken: this.userToken });
        }
    }

    private handleGoodMorningMessage(): void {
        if (this.isAuthorized) {
            logInfo({ event: "HandleGoodMorningMessage", message: "Handling initial message for authorized user", userToken: this.userToken });
            this.currentSession.initializePeerConnection(this.currentPeer, this.appEvent);
        } else {
            logWarning({ event: "UnauthorizedHandleGoodMorningMessage", message: "Initial message received for unauthorized user", userToken: this.userToken });
        }
    }

    private handleGoodByeMessage(): void {
            logInfo({ event: "HandleGoodByeMessage", message: "Handling initial message for authorized user", userToken: this.userToken });
            this.currentSession.removeUser(this.currentPeer.userToken);
            this.appEvent.close();
            this.destroy();
    }

    private handleClose(): void {
        logInfo({ event: "ConnectionClosed", message: "WebSocket connection closed", userToken: this.userToken });
    }

    private handleError(error: Error): void {
        logError({ event: "WebSocketError", message: "WebSocket error occurred", error, userToken: this.userToken });
    }

    //TODO added destroy session
    private destroy(): void {
        if (this.currentSession.getUsers().length === 0) {
            this.sessionManager.removeSession(this.currentSession.sessionToken)

        }
    }
}
