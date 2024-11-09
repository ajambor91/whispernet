import {AppEvent} from "./app-event.singleton";
import {ISignalMessage} from "../models/ws-message.model";
import {IPingPong} from "../interfaces/ping-pong.interface";
import {EWebSocketEventType} from "../enums/ws-message.enum";

class PingPong implements IPingPong {
    private static _instance: PingPong;
    private _appEvent: AppEvent = AppEvent.getInstance();

    private constructor() {
        this._handlePing();
    }

    public static getInstance(): PingPong {
        if (!this._instance) {
            this._instance = new PingPong();
        }
        return this._instance;
    }

    private _handlePing(): void {
        this._appEvent.off('signal', this._handlePingListener)
        this._appEvent.on('signal', this._handlePingListener)
    }

    private _handlePingListener = (data: ISignalMessage): void => {
        if (data.type === EWebSocketEventType.Ping) {
            const msg: ISignalMessage = {
                type: EWebSocketEventType.Pong,
                session: data.session
            }
            this._appEvent.sendPong(msg)
        }
    }
}

export const getPingPong = (): IPingPong => PingPong.getInstance();