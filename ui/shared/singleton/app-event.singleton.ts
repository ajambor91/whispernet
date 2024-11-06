import {EventEmitter} from 'events'
import {IAuthMessage, IOutgoingMessage, ISignalMessage} from "../models/ws-message.model";
import {IEventMessage} from "../models/event-message.model";
import {EWebSocketEventType} from "../enums/ws-message.enum";

export class AppEvent extends EventEmitter {
    private static _instance: AppEvent;
    private _ws: WebSocket = new WebSocket('/api/signal');

    private constructor() {
        super();
        this._ws.onmessage = async (message: MessageEvent) => {
            const {event, data} = await this.decodeMsg(message)
            this.emit(event, data);
        };
        this._ws.onopen = (event) => this.emit('open', event);
        this._ws.onclose = (event) => this.emit('close', event);
        this._ws.onerror = (error) => this.emit('error', error);
    }

    public static getInstance(): AppEvent {

        if (!this._instance) {
            this._instance = new AppEvent()
        }
        return this._instance;
    }

    public send(message: IEventMessage): void {

        this.sendMessage(message)
    }

    public sendPong(msg: ISignalMessage): void {

        const pongMessage: IEventMessage = {
            event: 'signal',
            data: msg
        }
        this.sendMessage(pongMessage);

    }

    public sendAuthMessage(message: IAuthMessage): void {
        const msg: IEventMessage = {
            event: 'auth',
            data: message
        }
        this.sendMessage(msg)
    }

    public readyState = () => this._ws.readyState;

    public sendWSMessage(wsMsg: IOutgoingMessage): void {
        const msg: IEventMessage = {
            event: 'dataMessage',
            data: wsMsg
        }
        this.sendMessage(msg)

    }

    public sendInitialMessage(): void {
        const msg: IEventMessage = {
            event: 'initialMessage',
            data: {
                type: EWebSocketEventType.InitialMessage
            }

        }
        this.sendMessage(msg)
    }

    private sendMessage(message: IEventMessage) : void {
        try {
            // this._ws.send(JSON.stringify(message))
            this._ws.send(this.parseMsg(message))

        } catch (e) {
            console.error('Cannot send message')
        }

    }

    private parseMsg(data: IEventMessage): Buffer {
        console.log(JSON.stringify(data))
        return Buffer.from(JSON.stringify(data), 'utf-8');
    }

    private decodeMsg(msg: MessageEvent): Promise<IEventMessage> {
        return new Promise((resolve, reject) => {
            const blob: Blob | string = msg.data;

            if (blob instanceof Blob) {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    const decodedMessage = new TextDecoder().decode(new Uint8Array(fileReader.result as ArrayBuffer));
                    resolve(JSON.parse(decodedMessage));
                };
                fileReader.onerror = reject;
                fileReader.readAsArrayBuffer(blob);
            } else {
                resolve(JSON.parse(blob as string));
            }
        });
    }
}

