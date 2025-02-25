import {IPeerState} from "../slices/createSession.slice";

export class ApprovingWs {
    private readonly _timeout: number = 5000;
    private readonly _tryTime: number = 500;
    private readonly _wsURL: string = "/api/approving";
    private readonly _ws: WebSocket;
    private readonly _peerState: IPeerState;
    private _interval: NodeJS.Timeout;

    constructor(peerState: IPeerState) {
        this._peerState = peerState;
        this._ws = new WebSocket(this._wsURL);
    }

    public sendAuthMessage(): void {
        this.waitForConnection().then(() => {
            this._ws.send(JSON.stringify({sessiontToken: this._peerState.sessionToken}));
        });
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

}