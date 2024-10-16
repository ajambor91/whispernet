import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { wsSessionMap } from "../mappers/wssessions.map";
import { clientsMap } from "../mappers/clients.map";
import { ClientsSession } from "../models/clients-session.model";
import * as console from "console";
import {WebRTCMessage} from "../models/webrtc-message.model";
import {WebRTCMessageEnum} from "../enums/webrtc-message-enum";
import {WebRTCIceCandidate, WebRTCSessionDescription} from "../models/webrtc.interface";

const getCookie: (req: IncomingMessage) => string = (req: IncomingMessage): string => {
    if (!req.headers?.cookie) {
        throw new Error("No user token cookie found!");
    }
    return req.headers.cookie.replace('sessionToken=', '');
};

const decodeMessage: (buffer: Buffer) => string = (buffer: Buffer): string => {
    if (!(buffer instanceof Buffer)) {
        throw new Error("No message found");
    }
    return buffer.toString();
};

const getClients: (decodedMessage: string) => string[] = (decodedMessage: string): string[] => {
    const clients: string[] | undefined = clientsMap.getClient(decodedMessage);
    if (typeof clients === 'undefined' || !Array.isArray(clients)) {
        throw new Error("No clients found!");
    }
    return clients;
};

const checkClientAuthorized: (clients: string[], userToken: string) => void = (clients: string[], userToken: string): void => {
    const isAuthorized: boolean = clients.some(client => client === userToken);
    if (!isAuthorized) {
        throw new Error("Client not authorized!");
    }
};

const getWsSession: (decodedMessage: string, userToken: string, ws: WebSocket) => ClientsSession = (decodedMessage: string, userToken: string, ws: WebSocket): ClientsSession => {
    let clientsSession: ClientsSession | undefined = wsSessionMap.getSession(decodedMessage);
    if (typeof clientsSession === 'undefined') {
        clientsSession = {
            [decodedMessage]: {
                [userToken]: ws
            }
        };
        wsSessionMap.setSession(decodedMessage, clientsSession);
    } else if (typeof clientsSession !== 'undefined' && typeof clientsSession[decodedMessage] !== 'undefined') {
        clientsSession[decodedMessage][userToken] = ws;
    } else {
        throw new Error("No session found!");
    }
    return clientsSession;
};

const sendMessages: (clientsSession: ClientsSession, decodedMessage: string) => void = (clientsSession: ClientsSession, decodedMessage: string): void => {
    const clientWsConnections: WebSocket[] = Object.values(clientsSession[decodedMessage]);
    console.log(clientsSession);
    if (clientWsConnections.length === 1) {
        clientWsConnections[0].send(Buffer.from('Waiting'));
    } else if (clientWsConnections.length > 1) {
        clientWsConnections.forEach((wsConn, index) => {
            console.log('INNNNNNNNN', index)
            wsConn.send(Buffer.from('Found client'));
        });
    }
};

const createStringMessage: (message: WebRTCMessage) => string = (message: WebRTCMessage) => {
    if (!message) {
        throw new Error("No message to send");
    }
    return JSON.stringify(message);
}

export const wsConnection = (): void => {
    const socket: WebSocket.Server = new WebSocket.Server({ port: 3000 });

    socket.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        try {
            const userToken: string = getCookie(req);

            ws.on('message', (message: Buffer) => {
                try {
                    const decodedMessage: string = decodeMessage(message);
                    const clients: string[] = getClients(decodedMessage);
                    checkClientAuthorized(clients, userToken);
                    const clientsSession: ClientsSession = getWsSession(decodedMessage, userToken, ws);
                    sendMessages(clientsSession, decodedMessage);
                } catch (e: unknown) {
                    if (e instanceof Error) {
                        console.error("Error processing WebSocket message:", e.message);
                    }
                }
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.error("Error establishing WebSocket connection:", e.message);
            }
        }
    });
};
