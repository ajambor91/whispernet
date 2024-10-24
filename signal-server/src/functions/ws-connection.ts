import WebSocket from 'ws';
import {IncomingMessage} from 'http';
import {websocketClientsHandler} from "./websocket-clients-handler";

export const wsConnection = (): void => {
    const socket: WebSocket.Server = new WebSocket.Server({ port: 3000 });
    console.log("WEB SOCKET SERVER INITIALIZED")

    socket.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        try {
            console.log("CLIENT CONNECTED")
            websocketClientsHandler(ws, req)
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.error("Error establishing WebSocket connection:", e.message);
            }
        }
    });
};
