import {AppEvent} from "./app-event.singleton";
import {WSMessage, WSSignalMessage} from "../models/ws-message.model";
import {WsMessageEnum} from "../enums/ws-message.enum";
import {ClientStatus} from "../enums/client-status.model";
import {IAuth} from "../interfaces/auth.interface";

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

    public authorize(message: WSMessage): void {
        this._appEvent.sendAuthMessage(message as WSMessage);

        this._appEvent.once('auth', (data: WSSignalMessage) => {
            console.log(data)
            if (data.type === WsMessageEnum.Authorized) {
                const msg: WSMessage = {
                    msgType: 'peer',
                    type: WsMessageEnum.Connect,
                    remotePeerStatus: ClientStatus.Unknown,
                    peerStatus: ClientStatus.Start,
                    session: message.session
                }
                this._appEvent.sendWSMessage(msg)
            }
        })
    }

    private handleAuth(message: WSMessage): Promise<boolean> {
        console.log("waitForConnection", message)
        return new Promise((resolve, reject) => {
            let interval: any
            if (this._appEvent && this._appEvent.readyState() === WebSocket.OPEN) {
                this._appEvent.sendAuthMessage(message)
                resolve(true)
            } else {
                interval = setInterval(() => {
                    console.log("waitForConnection socket", message)

                    if (this._appEvent && this._appEvent.readyState() === WebSocket.OPEN) {
                        this._appEvent.sendAuthMessage(message)
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