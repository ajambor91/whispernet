import WebSocket from "ws";
import {ClientStatus} from "../enums/client-status.enum";
import {Session} from "./session.model";
import {PeerRole} from "../enums/peer-role.enum";

export interface Client {
    userToken: string;
    userId: string;
    session: Session;
    status: ClientStatus;
    conn?: WebSocket;
    peerRole: PeerRole;
}

