import {AppEvent} from "./app-event.singleton";
import {IAuthMessage, IOutgoingMessage, ISession} from "../models/ws-message.model";
import {IAuth} from "../interfaces/auth.interface";
import {EWebSocketEventType} from "../enums/ws-message.enum";
import {EClientStatus} from "../enums/client-status.model";

class Auth implements IAuth {
    private static _instance: Auth;
    private _appEvent: AppEvent = AppEvent.getInstance();

    private constructor() {
    }

    public static getInstance(): Auth {
        if (!this._instance) {
            this._instance = new Auth();
        }
        return this._instance;
    }

    public async authorize(session: ISession): Promise<void> {
        await this.handleAuth(session)
        console.log("INNNNNN")
        this._appEvent.once('auth', (data: IAuthMessage) => this.startConnection(data))
    }

    private startConnection(data: IAuthMessage): void {
        if (data.type === EWebSocketEventType.Authorized) {
            this._appEvent.sendInitialMessage()
        }
    }

    private async handleAuth(message: ISession): Promise<boolean | unknown> {
        console.log("waitForConnection", message)
        const authMessage: IAuthMessage = {
            session: message,
            type: EWebSocketEventType.Auth
        }
        return new Promise((resolve, reject) => {
            let interval: any
            if (this._appEvent && this._appEvent.readyState() === WebSocket.OPEN) {
                this._appEvent.sendAuthMessage(authMessage)
                resolve(true)
            } else {
                interval = setInterval(() => {
                    console.log("waitForConnection socket", authMessage)

                    if (this._appEvent && this._appEvent.readyState() === WebSocket.OPEN) {
                        this._appEvent.sendAuthMessage(authMessage)
                        clearInterval(interval);
                        resolve(true)
                    }
                }, 100);
            }
            this._appEvent.on('error', (err) => {
                clearInterval(interval);
                reject(false);
            });

            this._appEvent.on('close', () => {
                clearInterval(interval);
                reject(false);
            });
        })

    }


}

export const getAuth = (): IAuth => Auth.getInstance();