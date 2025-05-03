import {ISession} from "../models/session.model";
import {IPeer} from "../models/peer.model";
import {ESessionStatus} from "../enums/session-status.enum";

export abstract class Session implements ISession{

    protected _peerClients: IPeer[] = [];
    protected _sessionStatus: ESessionStatus | undefined;
    protected _sessionToken: string | undefined;
    protected _sessionOffer: any;
    public get sessionStatus(): ESessionStatus {
        return this._sessionStatus as ESessionStatus;
    }
    public get peerClients() {
        return this._peerClients;
    }

    public get sessionToken() {
        return this._sessionToken as string;
    }

    public getSessionData(): ISession {
        if (!this._sessionToken) {
            throw new Error("Cannot get session data - sessionToken is undefined");
        }
        if (!this._sessionStatus) {
            throw new Error("Cannot get session data - sessionStatus is undefined")
        }
        if (this._peerClients.length === 0) {
            throw new Error("Cannot get session data - peerClients is empty")
        }

        return {
            sessionStatus: this._sessionStatus as ESessionStatus,
            sessionToken: this._sessionToken as string,
            peerClients: this._peerClients.map(peer => ({
                status: peer.status,
                userId: peer.userId,
                userToken: peer.userToken,
                peerRole: peer.peerRole
            }))
        }
    }
}