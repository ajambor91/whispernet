import WebSocket from "ws";
import {wsConnection} from "../functions/ws-connection";
import {ClientsSession} from "../models/clients-session.model";

class WssessionsMap {
    private readonly _wsSessions: Map<string, ClientsSession> = new Map<string, ClientsSession>();
    private static _instance: WssessionsMap;

    public static getInstance(): WssessionsMap {
        if (!this._instance) {
            this._instance = new WssessionsMap();
        }
        return this._instance;
    }

    public setSession(session: string, ws: ClientsSession): void{
        this._wsSessions.set(session, ws);
    }
   public getSession(session: string): ClientsSession | undefined {
        return this._wsSessions.get(session);
    }
}

export const wsSessionMap =  WssessionsMap.getInstance();