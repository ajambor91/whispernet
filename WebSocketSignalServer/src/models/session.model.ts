import {ESessionStatus} from "../enums/session-status.enum";
import {IPeer} from "./peer.model";
import {Peer} from "../classes/peer";


interface IBaseSession {
    sessionToken: string;
    sessionStatus: ESessionStatus;
}
export interface IPeerSession extends IBaseSession{
}

export interface ISession extends IBaseSession {
    peerClients: IPeer[];
}