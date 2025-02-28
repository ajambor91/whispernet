import {EClientStatus} from "../enums/client-status.enum";

export interface IPeer {
    readonly sessionToken: string;

    onStatus(callback: (data: EClientStatus) => void): this;

    onWebRTCMessage(callback: (data: string) => void): this;

    onSessionInfo(callback: (data: string) => void): this;

    sendWebRTCMessage(message: string): void;
}
