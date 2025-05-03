import {IPeerSession, ISession} from "./session.model";
import {PeerRole} from "../enums/peer-role.enum";
import {EClientStatus} from "../enums/client-status.enum";
import {AppEvent} from "../classes/app-event";


interface IBasePeer {
    userToken: string;
    peerRole: PeerRole;
    userId: string;
    status: EClientStatus;
}

export interface IInitialPeer extends IBasePeer {

}
export interface IPeer extends IBasePeer {
    conn?: AppEvent;
}

