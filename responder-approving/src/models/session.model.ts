import {IPeer} from "./peer.model";

export interface ISession {
    sessionToken: string;
    peers: IPeer[];
}