import WebSocket from "ws";
import {IncomingMessage} from "http";
import console from "console";
import {getSessionManager, SessionManager} from "../managers/session-manager";
import {AppEvent} from "../classes/base-event.class";
import {AuthController} from "./auth.controller";
import {SessionController} from "./session-controller";
import {Peer} from "../classes/peer";
import {getCookie} from "../functions/helpers";

export class WebSocketConnectionController {
    private ws: WebSocket;
    private req: IncomingMessage;
    private sessionManager: SessionManager;
    private isAuthorized: boolean = false;
    private userToken: string;
    private appEvent: AppEvent;
    private currentPeer!: Peer;
    private currentSession!: SessionController;

    constructor(ws: WebSocket, req: IncomingMessage) {
        this.ws = ws;
        this.req = req;
        this.sessionManager = getSessionManager;
        this.userToken = getCookie(req);
        this.appEvent = new AppEvent(ws);

        if (!this.userToken) {
            console.error("Invalid user token");
            this.ws.close();
            return;
        }

        this.initialize();
    }

    private initialize(): void {
        this.appEvent.once('auth', (data) => this.handleAuth(data));
        this.ws.on('close', () => this.handleClose());
        this.ws.on('error', (error) => this.handleError(error));
        this.appEvent.once('initialMessage', () => this.handleInitMessage())
    }

    private handleAuth(data: any): void {
        try {
            const sessionToken: string = data.session.sessionToken;
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


            this.appEvent.on('dataMessage', (data) => {
            });
        } catch (e) {
            console.error("Authorization error:", e);
        }
    }

    private handleInitMessage(): void {
        if (this.isAuthorized) {
            this.currentSession.initializePeerConnection(this.currentPeer, this.appEvent)

        }
    }


    private handleClose(): void {
        console.log("Connection closed for:", this.userToken);
    }

    private handleError(error: Error): void {
        console.error("WebSocket error:", error);
    }
}


