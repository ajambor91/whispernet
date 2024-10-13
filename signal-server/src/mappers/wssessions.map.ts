import WebSocket from "ws";
import {wsConnection} from "../functions/ws-connection";

export const wsSessions: Map<string, WebSocket> = new Map<string, WebSocket>();

export const setSession = (session: string, ws: WebSocket) => {
    wsSessions.set(session, ws);
}
export const getSession = (session: string):WebSocket | undefined=> {
    return wsSessions.get(session);
}