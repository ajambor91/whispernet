import WebSocket from 'ws';
import {IncomingMessage} from 'http';
import {wsSessionMap} from "../mappers/wssessions.map";
import {clientsMap} from "../mappers/clients.map";
import {Client, Clients, ClientsSession} from "../models/clients-session.model";
import * as console from "console";
import {WebRTCMessageEnum} from "../enums/webrtc-message-enum";
import {WebRTCMessage} from "../models/webrtc-message.model";
import {RTCIceServer} from "../models/rtc-ice-server.model";
import {SessionClients} from "../models/session-clients.model";

const getCookie: (req: IncomingMessage) => string = (req: IncomingMessage): string => {
    if (!req.headers?.cookie) {
        throw new Error("No user token cookie found!");
    }
    console.log("$coookie", req.headers.cookie)
    const regexp: RegExp = /sessionToken=([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i;
    const cookie: string = req.headers.cookie;
    const result: RegExpMatchArray | null = cookie.match(regexp);
    console.log('$result', result)
    let token: string;
    if (result && result[1]) {
        token = result[1]
    } else {
        throw new Error('No token found')
    }
    return token;
};

const decodeMessage: (buffer: Buffer) => string = (buffer: Buffer): string => {
    if (!(buffer instanceof Buffer)) {
        throw new Error("No message found");
    }
    return buffer.toString();
};

const getClients: (decodedMessage: string) => Client[] = (decodedMessage: string): Client[] => {
    const clients: Client[] | undefined = clientsMap.getClient(decodedMessage);
    if (typeof clients === 'undefined' || !Array.isArray(clients)) {
        throw new Error("No clients found!");
    }
    return clients;
};

const checkClientAuthorized: (clients: Client[], userToken: string) => void = (clients: Client[], userToken: string): void => {
    const isAuthorized: boolean = clients.some(client => client.userToken === userToken);
    if (!isAuthorized) {
        throw new Error("Client not authorized!");
    }
};

// const getWsSession: (decodedMessage: string, userToken: string, ws: WebSocket) => ClientsSession = (decodedMessage: string, userToken: string, ws: WebSocket): ClientsSession => {
//     let clientsSession: ClientsSession | undefined = wsSessionMap.getSession(decodedMessage);
//     if (typeof clientsSession === 'undefined') {
//         clientsSession = {
//             [decodedMessage]: {
//                 [userToken]: ws
//             }
//         };
//         wsSessionMap.setSession(decodedMessage, clientsSession);
//     } else if (typeof clientsSession !== 'undefined' && typeof clientsSession[decodedMessage] !== 'undefined') {
//         clientsSession[decodedMessage][userToken] = ws;
//     } else {
//         throw new Error("No session found!");
//     }
//     return clientsSession;
// };

const parseMessageJson: (message: WebRTCMessage) => string = (message:WebRTCMessage): string => {
    return JSON.stringify(message);
}
//
// const sendWaiting = (connections: WebSocket[], message: WebRTCMessage) => {
//     const webRTCMessage: WebRTCMessage = {
//         type: WebRTCMessageEnum.Waiting,
//         sessionId: message.sessionId
//     }
//     connections[0].send(Buffer.from(parseMessageJson(webRTCMessage)));
// }
//
// const sendFound = (connections: WebSocket[], message: WebRTCMessage) => {
//     const webRTCMessage: WebRTCMessage = {
//         type: WebRTCMessageEnum.Found,
//         sessionId: message.sessionId,
//     }
//     connections.forEach((wsConn, index) => {
//         wsConn.send(Buffer.from(parseMessageJson(webRTCMessage)));
//     });
// }

const getICEServers = (clients: Clients, message: WebRTCMessage, userToken: string) => {
   //  const ws: WebSocket = getClientSession(clients, userToken);
   //  const iceServers: RTCIceServer[] =  [{
   //      urls: [ "stun:fr-turn1.xirsys.com" ]
   //  }, {
   //      username: "d0z7JG_f-uEKOa6yoLFYkl4bYrPN6DioU5MkqiLQHAmTn2JOrRkVA9_0Wap5kukxAAAAAGcVRbRBamo5MTI=",
   //      credential: "7833a8be-8f0d-11ef-9a9b-0242ac120004",
   //      urls: [
   //          "turn:fr-turn1.xirsys.com:80?transport=udp",
   //          "turn:fr-turn1.xirsys.com:3478?transport=udp",
   //          "turn:fr-turn1.xirsys.com:80?transport=tcp",
   //          "turn:fr-turn1.xirsys.com:3478?transport=tcp",
   //          "turns:fr-turn1.xirsys.com:443?transport=tcp",
   //          "turns:fr-turn1.xirsys.com:5349?transport=tcp"
   //      ]}];
   //  const webRTCMessage: WebRTCMessage = {
   //      type: WebRTCMessageEnum.ICEResponse,
   //      sessionId: message.sessionId,
   //      metadata: {
   //          ice: iceServers
   //      }
   //  }
   // ws.send(Buffer.from(parseMessageJson(webRTCMessage)));
}

// export const omitClient = (clients: Clients, clientToOmit: string): Clients => {
//     const {[clientToOmit]: omitted, ...clientsToSend} = clients;
//     return clientsToSend;
// }

// const getClientSession = (clients: Clients, clientToGet: string): WebSocket => {
//     // return clients[clientToGet];
//     return new WebSocket();
// }


// const getSessionClients = (sessionClients: SessionClients, message: WebRTCMessage): Clients => {
//     return sessionClients[message.sessionId] as Clients;
// }
//
// const sendInitMessage = (clients: Clients, message: WebRTCMessage, clientToOmit: string) => {
//     const clientsCount: number = getClientsCount(clients)
//     const connections: WebSocket[] = getConnections(clients,message)
//
//     if (clientsCount=== 1) {
//         sendWaiting(connections, message)
//     } else if (clientsCount > 1) {
//         // const connections: WebSocket[] = getReceiversConns(clients, message, clientToOmit)
//         // connections.forEach((wsConn, index) => {
//             sendFound(connections, message)
//         // });
//     }
// }

// const getClientsCount = (clients: Clients) => {
//
//     return Object.keys(clients).length
//
// }
//
//
//
// const getConnections: (clients: Clients, webRTCMessage: WebRTCMessage) => WebSocket[] = (clients: Clients, webRTCMessage: WebRTCMessage): WebSocket[] => {
//         // return  clients[webRTCMessage.sessionId].conn;
//     return [] as WebSocket[];
// }
//
// const handleOffer = (connections: WebSocket[], message: WebRTCMessage, userToken: string) => {
//     message.type = WebRTCMessageEnum.IncommingOffer;
//     connections.forEach(ws => {
//         ws.send(parseMessageJson(message))
//     })
// }
//
// const handleAnswer = (connections: WebSocket[], message: WebRTCMessage) => {
//     connections.forEach(ws => {
//         ws.send(parseMessageJson(message))
//     })
// }
//
// const getReceiversConns = (clients: Clients, message: WebRTCMessage, userToken: string): WebSocket[] => {
//   const clientsToSend = omitClient(clients, userToken);
//   return getConnections(clientsToSend, message)
// }
// const handleJoin = handleAnswer;
// export const handleCandidate = handleAnswer;
//
// const handleReady = (connections: WebSocket[], message: WebRTCMessage) => {
//
// }
//
//
// const sendMessages: (sessionClients: SessionClients, message: WebRTCMessage, userToken: string) => void = (sessionClients: SessionClients, message: WebRTCMessage, userToken: string): void => {
//     const clients: Clients = getSessionClients(sessionClients, message)
//     const receiversConn: WebSocket[] = getReceiversConns(clients, message, userToken);
//     switch (message.type) {
//         case WebRTCMessageEnum.Join:
//             handleJoin(receiversConn, message);
//             break;
//         case WebRTCMessageEnum.Candidate:
//             handleCandidate(receiversConn, message)
//             break;
//         case WebRTCMessageEnum.Answer:
//             handleAnswer(receiversConn, message);
//             break;
//         case WebRTCMessageEnum.Init:
//             sendInitMessage(clients,message, userToken)
//             break;
//         case WebRTCMessageEnum.Offer:
//             handleOffer(receiversConn,message, userToken);
//             break
//         case WebRTCMessageEnum.Ready:
//         case WebRTCMessageEnum.ICERequest:
//             getICEServers(clients, message, userToken);
//             break;
//
//     }
//
// };

const parseForWebRTC: (decodedMessage: string) => WebRTCMessage = (decodeMessage:string): WebRTCMessage => {
    return JSON.parse(decodeMessage);
}
//
// const createStringMessage: (message: WebRTCMessage) => string = (message: WebRTCMessage) => {
//     if (!message) {
//         throw new Error("No message to send");
//     }
//     return JSON.stringify(message);
// }

export const wsConnection = (): void => {
    const socket: WebSocket.Server = new WebSocket.Server({ port: 3000 });

    socket.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        try {
            const userToken: string = getCookie(req);

            ws.on('message', (message: Buffer) => {
                try {
                    const decodedMessage: string = decodeMessage(message);
                    const webRTCMessage: WebRTCMessage = parseForWebRTC(decodedMessage);
                    const clients: Client[] = getClients(webRTCMessage.sessionId);
                    console.log('CLIENTS')
                    console.log(clients)
                    console.log('USER TOKEN')
                    console.log(userToken)
                    checkClientAuthorized(clients, userToken);
                    console.log(clients)
                    // sendMessages(clientsSession, webRTCMessage, userToken);
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
