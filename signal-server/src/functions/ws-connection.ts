import {Session} from "../models/session.model";
import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import * as console from "console";
import { wsSessionMap} from "../mappers/wssessions.map";
import {clientsMap} from "../mappers/clients.map";
export const wsConnection = () => {
    const socket: WebSocket.Server = new WebSocket.Server({port: 3000});
    socket.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        const cookie = req.headers.cookie;
        console.log('cookie',cookie)
        ws.on('message', (message: Buffer) => {
            if (message instanceof Buffer && !!cookie) {
                const decodeMessage: string = message.toString();
                console.log('message',message);
                console.log('decodeMessage',decodeMessage)
                const clients: string[] | undefined = clientsMap.getClient(decodeMessage);
                console.log('clitns', clients);
                if (!!clients && Array.isArray(clients)) {
                    const isClientTokenCorrect: boolean = clients.some(client => client === cookie.replace('sessionToken=', ''));
                    console.log('isClientTokenCorrect', isClientTokenCorrect);
                    if (isClientTokenCorrect) {
                        console.log('setSessssion');
                        let wsFromMap: WebSocket | undefined = wsSessionMap.getSession(decodeMessage);
                        if (!wsFromMap) {
                            wsSessionMap.setSession(decodeMessage, ws);
                            wsFromMap = ws;
                        }
                        wsFromMap?.send(Buffer.from('XXXXXXXXXXXXXXX'));
                    }
                }
            }


        })
    })
}