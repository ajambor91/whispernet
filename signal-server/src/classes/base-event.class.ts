import {WebSocket} from "ws";
import {EventEmitter} from 'events'
import {WSMessage, WSSignalMessage} from "../models/ws-message.model";
import {decodeMessage} from "../functions/helpers";
import {IEventMessage} from "../models/event-message.model";
import {ISession} from "../models/session.model";
import {EWebSocketEventType} from "../enums/ws-message.enum";

export class AppEvent extends EventEmitter {
    private _ws: WebSocket;
    public constructor(ws: WebSocket) {
        super();
        this._ws = ws;

        this._ws.on('message', (message: Buffer) => {
            console.log("message event", message)
            const { event, data } = decodeMessage(message)
            console.log("event, data", event, data)
            this.emit(event, data);
        });

        this.close = this._ws.close.bind(this._ws)

    }

    public close;

    public sendPingMessage(session: ISession): void {
        const message: IEventMessage = {
            event: 'signal',
            data: {
                msgType: 'signal',
                session: session,
                type: EWebSocketEventType.Ping,
            }
        }
        this._ws.send(this.parseMsg(message))
    }

    public sendAuthorizewMessage(session: ISession ): void {
        const message: IEventMessage = {
            event: 'auth',
            data: {
                msgType: 'signal',
                session: session,
                type: EWebSocketEventType.Authorized,
            }
        }
        this._ws.send(this.parseMsg(message))
    }

    public sendUnauthorizewMessage(): void {
        const message: IEventMessage = {
            event: 'auth',
            data: {
                msgType: 'signal',
                type: EWebSocketEventType.Unauthorized,
            }
        }
        this._ws.send(this.parseMsg(message))
    }
    public sendDataMessage(wsMsg: WSMessage): void {
        const msg: IEventMessage = {
            event: 'dataMessage',
            data: wsMsg
        }
        console.log("BASE EVENT SEND", msg)
        this._ws.send(this.parseMsg(msg))
    }
    private parseMsg(data: IEventMessage): Buffer {
        return Buffer.from(JSON.stringify(data), 'utf-8');
    }
}

