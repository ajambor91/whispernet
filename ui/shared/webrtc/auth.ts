import {AppEvent} from "./app-event.singleton";
import {IAuthMessage} from "../models/ws-message.model";
import {IAuth} from "../interfaces/auth.interface";
import {EWebSocketEventType} from "../enums/ws-message.enum";
import {EClientStatus} from "../enums/client-status.enum";
import {Peer} from "./peer";

class Auth implements IAuth {
    private _appEvent: AppEvent = AppEvent.getInstance();
    private _peer: Peer;
    public constructor(peer?: Peer) {
        this._peer = peer;
    }


    public async authorize(): Promise<void> {
        await this.handleAuth()
        this._appEvent.once('auth', (data: IAuthMessage) => this.startConnection(data))
    }

    private startConnection(data: IAuthMessage): void {
        if (data.type === EWebSocketEventType.Authorized) {
            this._appEvent.sendInitialMessage()
        }
    }

    private async handleAuth(): Promise<boolean | unknown> {
        const authMessage: IAuthMessage = {
            session: this._peer.session,
            type: EWebSocketEventType.Auth
        }
        return new Promise((resolve, reject) => {
            let interval: any
            if (this._appEvent && this._appEvent.readyState() === WebSocket.OPEN) {
                this._appEvent.sendAuthMessage(authMessage)
                resolve(true)
            } else {
                interval = setInterval(() => {
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
let auth: IAuth;
export const getAuth = (peer?: Peer): IAuth => {
    if (!peer && !auth) {
        throw new Error('No peer')
    }
    if (!auth) {
        auth = new Auth(peer);
    }
    return auth;
}