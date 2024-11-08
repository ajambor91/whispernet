import { EClientStatus } from "../enums/client-status.enum";
import { ISession } from "../models/ws-message.model";

export interface IPeer {
    readonly session: ISession;
    onStatus(callback: (data: EClientStatus) => void): this;
    onWebRTCMessage(callback: (data: string) => void): this;
    sendWebRTCMessage(message: string): void;
}
