import {AppEvent} from "./app-event.singleton";
import {WSSignalMessage} from "../models/ws-message.model";
import {WsMessageEnum} from "../enums/ws-message.enum";
import {IPingPong} from "../interfaces/ping-pong.interface";

class PingPong implements IPingPong {
    private static _instance: PingPong;
    private _appEvent: AppEvent = AppEvent.getInstance();

    private constructor() {
    }

    public static getInstance(): PingPong {
        if (!this._instance) {
            this._instance = new PingPong();
        }
        return this._instance;
    }

    public handlePing(): void {
        this._appEvent.off('signal', this.handlePingListener)
        this._appEvent.on('signal', this.handlePingListener)
    }

    private handlePingListener = (data: WSSignalMessage): void => {
        if (data.type === WsMessageEnum.Ping) {
            const msg: WSSignalMessage = {
                msgType: 'signal',
                type: WsMessageEnum.Pong,
                session: data.session
            }
            this._appEvent.sendPong(msg)
        }
    }
}

export const getPingPong = (): IPingPong => PingPong.getInstance();