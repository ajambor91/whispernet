import WebSocket from "ws";

export interface ClientsSession {
    [key: string]: Clients;
}
interface Clients {
    [key: string]: WebSocket
}