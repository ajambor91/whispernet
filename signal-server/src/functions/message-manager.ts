import {WSMessage} from "../models/ws-message.model";
import {createSessionManager, SessionManager, sessionMap} from "./session-manager";
import {Client} from "../models/client.model";
import {SenderReceiver} from "../models/sender-receiver.model";
import {WsMessageEnum} from "../enums/ws-message.enum";
import {ClientStatus} from "../enums/client-status.enum";
import {createStringWSMsg} from "./helpers";
import {RTCIceServer} from "../models/rtc-ice-server.model";

let test: boolean = true;

const senderReceiverHandler = (userToken: string, clients: Client[]): SenderReceiver => {
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
    clients.forEach(conn => conn.conn?.send(Buffer.from(createStringWSMsg(msg))));
}
const handleConnect = (msg: WSMessage, senderReceiver: SenderReceiver) => {
    const wsMessage: WSMessage = {
        session: msg.session,
        type: WsMessageEnum.Connected,
        peerStatus: ClientStatus.NotConnected,
        remotePeerStatus: ClientStatus.Unknown,
        metadata: {
            userId: senderReceiver.sender.userId
        }

    };
    sendMessage(wsMessage, [senderReceiver.sender])
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


    const iceServers: RTCIceServer[] = [
        { urls: 'stun:coturn:3478' },
        {
            urls: 'turn:coturn:3478',
            username: 'exampleuser',
            credential: 'examplepass'
        }
    ];

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
        offer: msg.offer,
        candidate: msg.candidate
    }
    sendMessage(wsMessage, clients.receivers)
}
const handleAnswer = (msg: WSMessage, clients: SenderReceiver) => {
    const wsMessage: WSMessage = {
        remotePeerStatus: msg.remotePeerStatus,
        peerStatus: msg.peerStatus,
        session: msg.session,
        answer: msg.answer,
        type: WsMessageEnum.Answer,
    }
    sendMessage(wsMessage, clients.receivers)
}
const handleCandidate = (msg: WSMessage, clients: SenderReceiver) => {
    const wsMessage: WSMessage = {
        remotePeerStatus: msg.remotePeerStatus,
        peerStatus: msg.peerStatus,
        session: msg.session,
        candidate: msg.candidate,
        type: WsMessageEnum.Candidate,
        metadata: {
            userId: clients.sender.userId
        }
    }
    sendMessage(wsMessage, clients.receivers)
}
const handleListen = (msg: WSMessage, clients: SenderReceiver) => {
    const wsMessage: WSMessage = {
        remotePeerStatus: msg.remotePeerStatus,
        peerStatus: msg.peerStatus,
        session: msg.session,
        candidate: msg.candidate,
        type: WsMessageEnum.Listen,

    }
    sendMessage(wsMessage, [clients.sender, ...clients.receivers])
}

const handlePeerReady = (msg: WSMessage, clients: SenderReceiver) => {
    const wsMessage: WSMessage = {
        remotePeerStatus: msg.remotePeerStatus,
        peerStatus: msg.peerStatus,
        session: msg.session,
        candidate: msg.candidate,
        type: WsMessageEnum.PeerReady,

    }
    sendMessage(wsMessage, [clients.sender, ...clients.receivers])
}

const handleMsgReceived = (msg: WSMessage, clients: SenderReceiver) => {
    const wsMessage: WSMessage = {
        remotePeerStatus: msg.remotePeerStatus,
        peerStatus: msg.peerStatus,
        session: msg.session,
        candidate: msg.candidate,
        type: WsMessageEnum.Ready,

    }
    sendMessage(wsMessage,[clients.sender, ...clients.receivers])
}
export const messageManager = (message: WSMessage, userToken: string): void => {

    let sessionManager: SessionManager | undefined = sessionMap.get(message.session.sessionToken);
    if (!sessionManager) {
        sessionManager = createSessionManager();
        sessionMap.set(message.session.sessionToken, sessionManager);
    }
    const clients: Client[] = sessionManager.getClients();
    const senderReceiver: SenderReceiver = senderReceiverHandler(userToken,clients);
    switch (message.type) {
        case WsMessageEnum.Connect:
            handleConnect(message, senderReceiver);
            break;
        case WsMessageEnum.PeerReady:
            handlePeerReady(message, senderReceiver);
            break;
        case WsMessageEnum.MsgReceived:
            handleMsgReceived(message,senderReceiver);
            break;
        case WsMessageEnum.Listen:
            handleListen(message, senderReceiver);
            break;
        case WsMessageEnum.Candidate:
            handleCandidate(message, senderReceiver)
            break;
        case WsMessageEnum.Answer:
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