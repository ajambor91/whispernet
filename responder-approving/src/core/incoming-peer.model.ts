import WebSocket from "ws";

export interface IIncomingPeer {
    sessionToken: string;
    userToken: string;
    userId?: string;
    ws?: WebSocket;
}