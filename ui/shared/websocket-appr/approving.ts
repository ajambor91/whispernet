import {IPeerState} from "../slices/createSession.slice";
import {EWsApprovingMsgType} from "../enums/ws-approving-msg-type.enum";
import {IApprovingMessageWs} from "../models/approving-message-ws.model";
import {EventEmitter} from "eventemitter3";

export class ApprovingWs extends EventEmitter{
    private readonly _timeout: number = 5000;
    private readonly _tryTime: number = 500;
    private readonly _wsURL: string = "/api/approving";
    private readonly _ws: WebSocket;
    private readonly _peerState: IPeerState;
    private _interval: NodeJS.Timeout;

    constructor(peerState: IPeerState) {
        super();
        this._peerState = peerState;
        this._ws = new WebSocket(this._wsURL);
    }

    public closeSocket(): void {
        this._ws.close();
    }

    public sendAuthMessage(): void {
        this.waitForConnection().then(() => {
            this.onMessage();
            const authMsg: IApprovingMessageWs = {
                sessionToken: this._peerState.sessionToken,
                type: EWsApprovingMsgType.AUTH
            }
            this._ws.send(JSON.stringify(authMsg));
        });
    }

    public acceptPartner(username: string): void {
        const acceptMessage: IApprovingMessageWs = {
            type: EWsApprovingMsgType.ACCEPT,
            sessionToken: this._peerState.sessionToken
        }
        this._ws.send(JSON.stringify(acceptMessage))
    }

    public declinePartner(username: string): void {
        const declineMessage: IApprovingMessageWs = {
            type: EWsApprovingMsgType.DECLINE,
            sessionToken: this._peerState.sessionToken
        }
        this._ws.send(JSON.stringify(declineMessage))
    }


    private onMessage(): void {

        this._ws.onmessage = async (data: MessageEvent) => {
            const parsedData: IApprovingMessageWs = await this.decodeMsg(data)
            this.emit("msg", parsedData);
        }
    }

    private async waitForConnection(): Promise<unknown> {
        let time: number = 0;

        return new Promise(((resolve, reject) => {
            this._interval = setInterval(() => {
                if (this._ws.readyState === WebSocket.OPEN) {
                    resolve(true);
                } else if (time >= this._timeout) {
                    reject();
                }
                time += this._tryTime;
            }, this._tryTime)

        }));
    }

    private decodeMsg(msg: MessageEvent): Promise<IApprovingMessageWs> {
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