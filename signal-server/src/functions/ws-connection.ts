import WebSocket from 'ws';
import {IncomingMessage} from 'http';
import {WebSocketConnectionController} from "../controllers/web-socker-connection.controller";
import {logError, logInfo} from "../error-logger/error-looger";

export const wsConnection = (): void => {
    const socket: WebSocket.Server = new WebSocket.Server({ port: 3000 });
    logInfo({data: "WebSocket server initialized"})

    socket.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        try {
            logInfo({data: "New client connected"})
            new WebSocketConnectionController(ws, req)
        } catch (e: unknown) {
            if (e instanceof Error) {
                logError({
                    data: "Error establishing WebSocket connection",
                    message: e.message,
                    stack: e.stack
                })
            }
        }
    });
};
