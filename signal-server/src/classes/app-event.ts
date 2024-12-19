import { WebSocket } from "ws";
import { EventEmitter } from 'events';
import { IOutgoingMessage } from "../models/ws-message.model";
import { decodeMessage } from "../functions/helpers";
import { IEventMessage } from "../models/event-message.model";
import {IPeerSession, ISession} from "../models/session.model";
import { EWebSocketEventType } from "../enums/ws-message.enum";
import { logInfo, logError } from "../error-logger/error-looger";

export class AppEvent extends EventEmitter {
    private _ws: WebSocket;

    public constructor(ws: WebSocket) {
        super();
        this._ws = ws;

        logInfo({ event: "connection", message: "WebSocket connection established" });

        this._ws.on('message', (message: Buffer) => {
            try {
                const { event, data } = decodeMessage(message);
                logInfo({ event: "receivedMessage", data: { event, data } });
                this.emit(event, data);
            } catch (error) {
                logError({ event: "receivedMessageError", message: "Error decoding message", error });
            }
        });

        this._ws.on('close', (code: number, reason: Buffer) => {
            logInfo({
                event: "close",
                message: "WebSocket connection closed",
                code,
                reason: reason.toString(),
            });
        });

        this.close = this._ws.close.bind(this._ws);
    }

    public close;

    public sendPingMessage(sessionToken: string): void {
        const message: IEventMessage = {
            event: 'signal',
            data: {
                sessionToken: sessionToken,
                type: EWebSocketEventType.Ping,
            }
        };
        this.sendMessageWithLogging(message, "sendPingMessage");
    }

    public sendAuthorizeMessage(sessionToken: string): void {
        const message: IEventMessage = {
            event: 'auth',
            data: {
                sessionToken: sessionToken,
                type: EWebSocketEventType.Authorized,
            }
        };
        this.sendMessageWithLogging(message, "sendAuthorizeMessage");
    }

    public sendUnauthorizeMessage(): void {
        const message: IEventMessage = {
            event: 'auth',
            data: {
                type: EWebSocketEventType.Unauthorized,
            }
        };
        this.sendMessageWithLogging(message, "sendUnauthorizeMessage");
    }

    public sendDataMessage(wsMsg: IOutgoingMessage): void {
        const msg: IEventMessage = {
            event: 'dataMessage',
            data: wsMsg
        };
        this.sendMessageWithLogging(msg, "sendDataMessage");
    }

    private parseMsg(data: IEventMessage): Buffer {
        return Buffer.from(JSON.stringify(data), 'utf-8');
    }

    private sendMessageWithLogging(message: IEventMessage, logEvent: string): void {
        try {
            const parsedMessage = this.parseMsg(message);
            logInfo({ event: logEvent, message: "Sending message", data: message });
            this._ws.send(parsedMessage);
        } catch (error) {
            logError({ event: logEvent, message: "Error sending message", error });
        }
    }
}
