import {EventEmitter} from "events";
import {IPeer} from "../models/peer.model";
import WebSocket from "ws";

export class Peer extends EventEmitter implements IPeer {
    public constructor(peer: IPeer) {
        super();
        this._userId = peer.userId;
        this._userToken = peer.userToken;
    }

    private _userId: string;

    public get userId(): string {
        return this._userId;
    }

    private _userToken: string;

    public get userToken(): string {
        return this._userToken;
    }

    private _webSocket!: WebSocket;

    public set webSocket(webSocket: WebSocket) {
        this._webSocket = webSocket;
    }

}