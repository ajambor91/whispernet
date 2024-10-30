import WebSocket from "ws";
import {ISession} from "./session.model";
import {PeerRole} from "../enums/peer-role.enum";
import {EClientConnectionStatus} from "../enums/client-connection-status.enum";
import {IClientCallbacks} from "./client-callbacks.model";
import {EWebSocketEventType} from "../enums/ws-message.enum";
import {EClientStatus} from "../enums/client-status.enum";
import {WSSignalMessage} from "./ws-message.model";

export interface IClient {
    userToken: string;
    userId: string;
    session: ISession;
    status: EClientStatus;
    conn?: WebSocket;
    peerRole: PeerRole;
    stage: EWebSocketEventType;
    pingInterval: NodeJS.Timer | null;
    connectionStatus: EClientConnectionStatus;
    initClient: (clientCallbacks: IClientCallbacks) => void;
    handlePong: (wsSignalMsg: WSSignalMessage) => void
}

