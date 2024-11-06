import {ISession} from "./session.model";
import {PeerRole} from "../enums/peer-role.enum";
import {EClientConnectionStatus} from "../enums/client-connection-status.enum";
import {IClientCallbacks} from "./client-callbacks.model";
import {EWebSocketEventType} from "../enums/ws-message.enum";
import {EClientStatus} from "../enums/client-status.enum";
import {AppEvent} from "../classes/base-event.class";

import {IIncomingMessage} from "./ws-message.model";


export interface IInitialClient {
    userToken: string;
    peerRole: PeerRole;
    userId: string;
    status: EClientStatus;
    session: ISession;

}
export interface IClient {
    conn?: AppEvent;
    partnerPeer: any;
    // stage: EWebSocketEventType;
    // pingInterval: NodeJS.Timer | null;
    // connectionStatus: EClientConnectionStatus;
    // initClient: (clientCallbacks: IClientCallbacks) => void;
    // emitStatus: (status: EClientStatus) => void;
    // onStatus: (fn: (incommingMessage: IIncomingMessage) => void)=> void
}

