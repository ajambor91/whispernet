import WebSocket from "ws";

export interface ClientsSession {
    [key: string]: Clients;
}
export interface Clients {
    [key: string]: WebSocket
}