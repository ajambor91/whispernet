import {Session} from "../models/session.model";
import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import * as console from "console";
import {getSession, setSession} from "../mappers/wssessions.map";
import {getClient} from "../mappers/clients.map";
export const wsConnection = () => {
    const socket: WebSocket.Server = new WebSocket.Server({port: 3000});
    socket.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        const cookie = req.headers.cookie;
        console.log('cookie',cookie)
        ws.on('message', (message: string) => {
            console.log('message',message);
            const clients = getClient(message);
            const isClientTokenCorrect: boolean = !!clients.some(client => client === cookie);
            console.log('isClientTokenCorrect', isClientTokenCorrect);
            if (isClientTokenCorrect) {
                setSession(message, ws);
            }
        })
    })
}