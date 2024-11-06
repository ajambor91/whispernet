import {WebSocket} from "ws";
import {EventEmitter} from 'events'
import {IIncomingMessage, IOutgoingMessage} from "../models/ws-message.model";
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
            const { event, data } = decodeMessage(message)
            this.emit(event, data);
        });

        this.close = this._ws.close.bind(this._ws)

    }

    public close;

    public sendPingMessage(session: ISession): void {
        const message: IEventMessage = {
            event: 'signal',
            data: {
                session: session,
                type: EWebSocketEventType.Ping,
            }
        }
        this._ws.send(this.parseMsg(message))
    }

    public sendAuthorizeMessage(session: ISession ): void {
        const message: IEventMessage = {
            event: 'auth',
            data: {
                session: session,
                type: EWebSocketEventType.Authorized,
            }
        }
        this._ws.send(this.parseMsg(message))
    }

    public sendUnauthorizeMessage(): void {
        const message: IEventMessage = {
            event: 'auth',
            data: {
                type: EWebSocketEventType.Unauthorized,
            }
        }
        this._ws.send(this.parseMsg(message))
    }
    public sendDataMessage(wsMsg: IOutgoingMessage): void {
        const msg: IEventMessage = {
            event: 'dataMessage',
            data: wsMsg
        }
        this._ws.send(this.parseMsg(msg))
    }
    private parseMsg(data: IEventMessage): Buffer {
        return Buffer.from(JSON.stringify(data), 'utf-8');
    }
}

