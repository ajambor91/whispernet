import WebSocket from "ws";

export interface IPeer {
    userId?: string;
    webSocket?: WebSocket;
    userToken: string;
}

