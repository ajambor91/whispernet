import WebSocket from 'ws';
import {IncomingMessage} from 'http';
import {wsSessionMap} from "../mappers/wssessions.map";
import {clientsMap} from "../mappers/clients.map";
import {Clients, ClientsSession} from "../models/clients-session.model";
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

export const omitClient = (clients: Clients, clientToOmit: string): Clients => {
    const {[clientToOmit]: omitted, ...clientsToSend} = clients;
    return clientsToSend;
}

const getSessionClients = (clientsSession: ClientsSession, message: WebRTCMessage): Clients => {
    return clientsSession[message.sessionId];
}

const sendInitMessage = (clients: Clients, message: WebRTCMessage, clientToOmit: string) => {
    const clientsCount: number = getClientsCount(clients)
    if (clientsCount=== 1) {
        const connections: WebSocket[] = getConnections(clients,message)
        sendWaiting(connections, message)
    } else if (clientsCount > 1) {
        const connections: WebSocket[] = getReceiversConns(clients, message, clientToOmit)
        connections.forEach((wsConn, index) => {
            sendFound(connections, message)
        });
    }
}

const getClientsCount = (clients: Clients) => {

    return Object.keys(clients).length

}



const getConnections: (clients: Clients, webRTCMessage: WebRTCMessage) => WebSocket[] = (clients: Clients, webRTCMessage: WebRTCMessage): WebSocket[] => {
        return  Object.values(clients);
}

const handleOffer = (connections: WebSocket[], message: WebRTCMessage, userToken: string) => {
    message.type = WebRTCMessageEnum.IncommingOffer;
    console.log('handleOffer    handleOffer   handleOffer   handleOffer   handleOffer   handleOffer')
    console.log('conncetions', connections)
    connections.forEach(ws => {
        ws.send(parseMessageJson(message))
    })
}

const handleAnswer = (connections: WebSocket[], message: WebRTCMessage) => {
    console.log('handleOffer    handleOffer   handleOffer   handleOffer   handleOffer   handleOffer')
    console.log('conncetions', connections)
    connections.forEach(ws => {
        ws.send(parseMessageJson(message))
    })
}

const getReceiversConns = (clients: Clients, message: WebRTCMessage, userToken: string): WebSocket[] => {
  console.log('clients', clients)
  const clientsToSend = omitClient(clients, userToken);
  console.log('oomittted',clientsToSend)
  return getConnections(clientsToSend, message)
}

const sendMessages: (clientsSession: ClientsSession, message: WebRTCMessage, userToken: string) => void = (clientsSession: ClientsSession, message: WebRTCMessage, userToken: string): void => {
    const clients: Clients = getSessionClients(clientsSession, message)
    console.log("clientssss",clients)
    const receiversConn: WebSocket[] = getReceiversConns(clients, message, userToken);
    console.log("TYPE MESSAGE",message.type)
    switch (message.type) {
        case WebRTCMessageEnum.Answer:
            handleAnswer(receiversConn, message);
            break;
        case WebRTCMessageEnum.Init:
            sendInitMessage(clients,message, userToken)
            break;
        case WebRTCMessageEnum.Offer:
            handleOffer(receiversConn,message, userToken);
            break;

    }

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
