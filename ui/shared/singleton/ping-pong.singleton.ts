import {AppEvent} from "./app-event.singleton";
import {ISignalMessage} from "../models/ws-message.model";
import {IPingPong} from "../interfaces/ping-pong.interface";
import {EWebSocketEventType} from "../enums/ws-message.enum";

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

    private handlePingListener = (data: ISignalMessage): void => {
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