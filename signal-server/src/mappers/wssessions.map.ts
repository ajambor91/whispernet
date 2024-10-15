import WebSocket from "ws";
import {wsConnection} from "../functions/ws-connection";

class WssessionsMap {
    private readonly _wsSessions: Map<string, WebSocket> = new Map<string, WebSocket>();
    private static _instance: WssessionsMap;

    public static getInstance(): WssessionsMap {
        if (!this._instance) {
            this._instance = new WssessionsMap();
        }
        return this._instance;
    }

    public setSession(session: string, ws: WebSocket): void{
        this._wsSessions.set(session, ws);
    }
   public getSession(session: string):WebSocket | undefined {
        return this._wsSessions.get(session);
    }
}

export const wsSessionMap =  WssessionsMap.getInstance();