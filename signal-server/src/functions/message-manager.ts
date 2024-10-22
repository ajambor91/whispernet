import {WSMessage} from "../models/ws-message.model";
import {createSessionManager, SessionManager, sessionMap} from "./session-manager";
import {Client} from "../models/client.model";
import {SenderReceiver} from "../models/sender-receiver.model";
import {WsMessageEnum} from "../enums/ws-message.enum";
import {ClientStatus} from "../enums/client-status.enum";
import {createStringWSMsg} from "./helpers";
import console from "console";
import {RTCIceServer} from "../models/rtc-ice-server.model";
import {PeerRole} from "../enums/peer-role.enum";

let test: boolean = true;

const senderReceiverHandler = (userToken: string, clients: Client[]): SenderReceiver => {
    console.log
    let sender: Client | undefined;
    const receivers: Client[] = [];
    clients.forEach(client => {
        if (client.userToken === userToken) {
            sender = client;
        } else {
            receivers.push(client)
        }
    });
    if (!sender) {
        throw new Error("Receiver not found");
    }
    return {
        receivers: receivers,
        sender: sender
    }

}
const sendMessage = (msg: WSMessage, clients: Client[]) => {
    console.log("$$$$$ send message $$$$")
    clients.forEach(conn => conn.conn?.send(Buffer.from(createStringWSMsg(msg))));
}
const handleStart = (msg: WSMessage, clients: SenderReceiver) => {
    let wsMessage: WSMessage;
    if (clients.receivers.length === 0) {
        wsMessage = {
            session: msg.session,
            type: WsMessageEnum.Waiting,
            peerStatus: ClientStatus.Waiting,
            remotePeerStatus: ClientStatus.NotConnected,
        }
        sendMessage(wsMessage, [clients.sender])
    } else {
        wsMessage = {
            session: msg.session,
            type: WsMessageEnum.Init,
            peerStatus: ClientStatus.Connected,
            remotePeerStatus: ClientStatus.Connected,
        }
        sendMessage(wsMessage, [clients.sender, ...clients.receivers])

    }
}

const handleInitAccepted = (msg: WSMessage, clients: SenderReceiver) => {
    const wsMessage: WSMessage = {
        remotePeerStatus: msg.remotePeerStatus,
        peerStatus: msg.peerStatus,
        session: msg.session,
        type: WsMessageEnum.InitAccepted,
    }
    sendMessage(wsMessage, clients.receivers)
}

const handleRoleAccepted = (msg: WSMessage, clients: SenderReceiver) => {
    const wsMessage: WSMessage = {
        remotePeerStatus: msg.remotePeerStatus,
        peerStatus: msg.peerStatus,
        session: msg.session,
        type: WsMessageEnum.PrepareRTC,
    }
    sendMessage(wsMessage, clients.receivers)
}


const handleICEAccepted = (msg: WSMessage, clients: SenderReceiver) => {
    if (test) {
        test = false;

    }
    const wsMessage: WSMessage = {
        remotePeerStatus: msg.remotePeerStatus,
        peerStatus: msg.peerStatus,
        session: msg.session,
        type: WsMessageEnum.ICEAccepted,
    }
    sendMessage(wsMessage, clients.receivers)
}
const handleICERequest = (msg: WSMessage, senderReceiver: SenderReceiver) => {
    const iceServers: RTCIceServer[] =  [{
        urls: [ "stun:fr-turn1.xirsys.com" ]
    }, {
        username: "d0z7JG_f-uEKOa6yoLFYkl4bYrPN6DioU5MkqiLQHAmTn2JOrRkVA9_0Wap5kukxAAAAAGcVRbRBamo5MTI=",
        credential: "7833a8be-8f0d-11ef-9a9b-0242ac120004",
        urls: [
            "turn:fr-turn1.xirsys.com:80?transport=udp",
            "turn:fr-turn1.xirsys.com:3478?transport=udp",
            "turn:fr-turn1.xirsys.com:80?transport=tcp",
            "turn:fr-turn1.xirsys.com:3478?transport=tcp",
            "turns:fr-turn1.xirsys.com:443?transport=tcp",
            "turns:fr-turn1.xirsys.com:5349?transport=tcp"
        ]}];
    const wsMessage: WSMessage = {
        remotePeerStatus: msg.peerStatus,
        session: msg.session,
        type: WsMessageEnum.ICEResponse,
        peerStatus: msg.remotePeerStatus,
        metadata: iceServers,
    };
    sendMessage(wsMessage, senderReceiver.receivers)
}

const handleRoleRequest = (msg: WSMessage, clients: SenderReceiver, userToken: string, sesssionManager: SessionManager) => {

    const wsMessage: WSMessage = {
        remotePeerStatus: msg.remotePeerStatus,
        peerStatus: msg.peerStatus,
        session: msg.session,
        type: WsMessageEnum.RoleResponse,
        metadata: {role: sesssionManager.getClient(userToken).peerRole}
    }
    sendMessage(wsMessage, clients.receivers)
}
const handleOffer = (msg: WSMessage, clients: SenderReceiver) => {
    const wsMessage: WSMessage = {
        remotePeerStatus: msg.remotePeerStatus,
        peerStatus: msg.peerStatus,
        session: msg.session,
        type: WsMessageEnum.IncommingOffer,
        offer: msg.offer
    }
    console.log('ASDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    sendMessage(wsMessage, clients.receivers)
}
const handleAnswer = (msg: WSMessage, clients: SenderReceiver) => {
    const wsMessage: WSMessage = {
        remotePeerStatus: msg.remotePeerStatus,
        peerStatus: msg.peerStatus,
        session: msg.session,
        type: WsMessageEnum.Ready,
    }
    sendMessage(wsMessage, clients.receivers)
}
const handleCandidate = (msg: WSMessage, clients: SenderReceiver) => {
    const wsMessage: WSMessage = {
        remotePeerStatus: msg.remotePeerStatus,
        peerStatus: msg.peerStatus,
        session: msg.session,
        type: WsMessageEnum.Candidate,
    }
    sendMessage(wsMessage, clients.receivers)
}
const handleJoin = handleOffer;
export const messageManager = (message: WSMessage, userToken: string): void => {

    let sessionManager: SessionManager | undefined = sessionMap.get(message.session.sessionToken);
    if (!sessionManager) {
        sessionManager = createSessionManager();
        sessionMap.set(message.session.sessionToken, sessionManager);
    }
    const clients: Client[] = sessionManager.getClients();
    const senderReceiver: SenderReceiver = senderReceiverHandler(userToken,clients);
    switch (message.type) {
        case WsMessageEnum.Join:
            handleJoin(message, senderReceiver);
            break;
        case WsMessageEnum.Candidate:
            handleCandidate(message, senderReceiver)
            break;
        case WsMessageEnum.Answer:
            console.log('ANWSWEEEEEDSHJKFDHUIYLEWFGULYIEGFDUIYWEGDHFIU')
            handleAnswer(message, senderReceiver);
            break;
        case WsMessageEnum.Start:
            handleStart(message, senderReceiver)
            break;
        case WsMessageEnum.InitAccepted:
            handleInitAccepted(message, senderReceiver);
            break
        case WsMessageEnum.ICERequest:
            handleICERequest(message, senderReceiver)
            break;
        case WsMessageEnum.ICEAccepted:
            handleICEAccepted(message,senderReceiver);
            break;
        case WsMessageEnum.RoleRequest:
            handleRoleRequest(message,senderReceiver, userToken, sessionManager);
            break;
        case WsMessageEnum.RoleAccepted:
            handleRoleAccepted(message,senderReceiver);
            break;
        case WsMessageEnum.Offer:
            handleOffer(message, senderReceiver);
            break;
    }

};