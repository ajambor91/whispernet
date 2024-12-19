import {ISession} from "../models/session.model";
import {IPeer} from "../models/peer.model";
import {ESessionStatus} from "../enums/session-status.enum";

export abstract class Session  {

    protected _peerClients: IPeer[] = [];
    protected _sessionStatus: ESessionStatus | undefined;
    protected _sessionToken: string | undefined;
    public get sessionStatus(): ESessionStatus {
        return this._sessionStatus as ESessionStatus;
    }
    public get peerClients() {
        return this._peerClients;
    }

    public get sessionToken() {
        return this._sessionToken as string;
    }





}