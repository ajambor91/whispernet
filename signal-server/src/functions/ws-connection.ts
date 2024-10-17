import WebSocket from 'ws';
import {IncomingMessage} from 'http';
import {wsSessionMap} from "../mappers/wssessions.map";
import {clientsMap} from "../mappers/clients.map";
import {ClientsSession} from "../models/clients-session.model";
import * as console from "console";
import {WebRTCMessageEnum} from "../enums/webrtc-message-enum";
import {WebRTCMessage} from "../models/webrtc-message.model";

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

const parseMessageJson: (message: WebRTCMessage) => string = (message:WebRTCMessage): string => {
    return JSON.stringify(message);
}

const sendWaiting = (connections: WebSocket[], message: WebRTCMessage) => {
    const webRTCMessage: WebRTCMessage = {
        type: WebRTCMessageEnum.Waiting,
        sessionId: message.sessionId
    }
    connections[0].send(Buffer.from(parseMessageJson(webRTCMessage)));
}

const sendFound = (connections: WebSocket[], message: WebRTCMessage) => {
    const webRTCMessage: WebRTCMessage = {
        type: WebRTCMessageEnum.Found,
        sessionId: message.sessionId,
    }
    connections.forEach((wsConn, index) => {
        console.log('INNNNNNNNN', index)
        wsConn.send(Buffer.from(parseMessageJson(webRTCMessage)));
    });
}

const sendInitMessage = (connections: WebSocket[], message: WebRTCMessage) => {
    console.log("CCCCCCCCCCCCCCCC")
    if (connections.length === 1) {
        sendWaiting(connections, message)
    } else if (connections.length > 1) {
        connections.forEach((wsConn, index) => {
            sendFound(connections, message)
        });
    }
}

const getConnections: (clientWsConnections: ClientsSession, webRTCMessage: WebRTCMessage, excludeClient?: string) => WebSocket[] = (clientsSession: ClientsSession, webRTCMessage: WebRTCMessage, excludeClient?: string): WebSocket[] => {
    if (!excludeClient) {
        return  Object.values(clientsSession[webRTCMessage.sessionId]);

    }   else {
        const {[excludeClient]: omitted, ...clients} = clientsSession[webRTCMessage.sessionId];
        return Object.values(clients);
    }


}

const sendOffer = (clientsSession: ClientsSession, message: WebRTCMessage, userToken: string) => {
    message.type = WebRTCMessageEnum.IncommingOffer;
    const connections: WebSocket[] = getConnections(clientsSession, message, userToken);
    connections.forEach(ws => {
        ws.send(parseMessageJson(message))
    })
}

const sendMessages: (clientsSession: ClientsSession, message: WebRTCMessage, userToken: string) => void = (clientsSession: ClientsSession, message: WebRTCMessage, userToken: string): void => {
    const connections: WebSocket[] = getConnections(clientsSession, message);
    console.log("TYPE MESSAGE",message.type)
    switch (message.type) {
        case WebRTCMessageEnum.Init:
            sendInitMessage(connections,message)
            break;
        case WebRTCMessageEnum.Offer:
            sendOffer(clientsSession,message, userToken);
            break;

    }
    console.log(clientsSession);

};

const parseForWebRTC: (decodedMessage: string) => WebRTCMessage = (decodeMessage:string): WebRTCMessage => {
    return JSON.parse(decodeMessage);
}

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
                    const webRTCMessage: WebRTCMessage = parseForWebRTC(decodedMessage);
                    console.log(JSON.parse(decodedMessage));
                    const clients: string[] = getClients(webRTCMessage.sessionId);
                    checkClientAuthorized(clients, userToken);
                    const clientsSession: ClientsSession = getWsSession(webRTCMessage.sessionId, userToken, ws);
                    sendMessages(clientsSession, webRTCMessage, userToken);
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
