import {EventEmitter} from "events";
import {TEventName} from "../types/event-name.type";
import {IInternalMessage} from "../models/internal-message.model";

export abstract class PeerEmitter extends EventEmitter {
    public on(eventName: TEventName, listener: (data: IInternalMessage) => void) {
        return super.on(eventName, listener )
    }

    public emit(eventName: TEventName, ...args: [IInternalMessage]): boolean {
        return super.emit(eventName, ...args)
    }

    public emitStatus(internalMessage: IInternalMessage): void {
        this.emit('clientMessage', internalMessage);
    }

    public onStatus(fn: (internalMessage: IInternalMessage) => void): void {
        this.on('clientMessage', fn);
    }
}