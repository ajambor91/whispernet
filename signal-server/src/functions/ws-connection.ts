import WebSocket from 'ws';
import {IncomingMessage} from 'http';
import {WebSocketConnectionController} from "../controllers/web-socker-connection.controller";

export const wsConnection = (): void => {
    const socket: WebSocket.Server = new WebSocket.Server({ port: 3000 });
    console.log("WEB SOCKET SERVER INITIALIZED")

    socket.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        try {
            console.log("CLIENT CONNECTED")
            new WebSocketConnectionController(ws, req)
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.error("Error establishing WebSocket connection:", e.message);
            }
        }
    });
};
