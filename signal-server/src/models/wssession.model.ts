import {Session} from "./session.model";
import WebSocket from "ws";

export interface Wssession extends Session{
    ws: WebSocket
}

