import WebSocket from 'ws';
import {IncomingMessage} from 'http';

import {Client} from "../models/client.model";
import {WSMessage} from "../models/ws-message.model";
import {websocketClientsHandler} from "./websocket-clients-handler";

export const wsConnection = (): void => {
    const socket: WebSocket.Server = new WebSocket.Server({ port: 3000 });

    socket.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        try {
            websocketClientsHandler(ws, req)
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.error("Error establishing WebSocket connection:", e.message);
            }
        }
    });
};
