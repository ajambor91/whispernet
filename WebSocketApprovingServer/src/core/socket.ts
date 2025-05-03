import WebSocket from 'ws';
import {Orchestrator} from "./orchestrator";
import {IncomingMessage} from "http";
import {logInfo} from "../logger/looger";


export class Socket {
    private static instance: Socket;
    private readonly _ws: WebSocket.Server<typeof WebSocket.WebSocket, typeof IncomingMessage>;
    private readonly _orchestrator: Orchestrator;

    private constructor(port: number, orchestrator: Orchestrator) {
        this._ws = new WebSocket.Server({port});
        this._orchestrator = orchestrator;
        this.onConnection();
        logInfo({message: "Initialized WebSocket server"})
    }

    public static getInstance(port: number, orchestrator: Orchestrator) {
        if (!Socket.instance) {
            Socket.instance = new Socket(port, orchestrator);
        }
        return Socket.instance;
    }

    private onConnection(): void {
        this._ws.on("connection", (ws: WebSocket, req: any) => {
            logInfo({message: "New WebSocket Connection"})
            this._orchestrator.setSocketToExistingPeer(ws, req);
        })
    }
}