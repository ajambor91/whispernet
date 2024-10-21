import WebSocket from "ws";
import {WebrtcStatus} from "../enums/webrtc-status.enum";

export interface ClientsSession {
    [key: string]: Clients;
}
export interface Clients {
    [key: string]: Client
}

export interface Client {
    userToken: string;
    conn: WebSocket;
    sessionToken: string;
    status: WebrtcStatus;
}