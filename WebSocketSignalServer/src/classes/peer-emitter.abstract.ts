import {EventEmitter} from "events";
import {TEventName} from "../types/event-name.type";
import {IInternalMessage} from "../models/internal-message.model";
import {ITechnicalMessage} from "../models/ws-message.model";

export abstract class PeerEmitter extends EventEmitter {

    public on(eventName: TEventName, listener: (data: any) => void) {
        return super.on(eventName, listener )
    }
    public emit(eventName: TEventName, ...args: [any]): boolean {
        return super.emit(eventName, ...args)
    }

    public emitStatus(internalMessage: IInternalMessage): void {
        this.emit('clientMessage', internalMessage);
    }

    public onStatus(fn: (internalMessage: IInternalMessage) => void): void {
        this.on('clientMessage', fn);
    }

    public emitCloseConnection(internalMessage: ITechnicalMessage): void {
        this.emit('closeConnection', internalMessage as ITechnicalMessage );
    }

    public onCloseConnection(fn: (internalMessage: ITechnicalMessage) => void): void {
        this.on('closeConnection', fn);
    }
}