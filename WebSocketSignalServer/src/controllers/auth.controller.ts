import {AppEvent} from "../classes/app-event";
import {IAuthMessage} from "../models/ws-message.model";

import {Peer} from "../classes/peer";

export class AuthController {
    private readonly _userToken: string;
    private readonly _user: Peer;
    private readonly _appEvent: AppEvent;
    private readonly _authMessage: IAuthMessage;
    public constructor(userToken: string, user: Peer, authMessage: IAuthMessage, appEvent: AppEvent) {
        this._appEvent = appEvent;
        this._userToken = userToken;
        this._authMessage = authMessage;
        this._user = user;
    }

    public authorize(): void {
        try {
            this.checkUser();
            this._appEvent.sendAuthorizeMessage(this._user.session.sessionToken);
        } catch (e) {
            this._appEvent.close();
            if (e instanceof Error) {
                throw e;
            }
            throw new Error("Unknown error during authorization");
        }
    }

    private checkUser(): boolean {
        if (this._user.userToken !== this._userToken) {
            this._appEvent.sendUnauthorizeMessage();
            this._appEvent.close();
            throw new Error('User token mismatch');
        }

        if (this._user.session.sessionToken !== this._authMessage.sessionToken) {
            this._appEvent.sendUnauthorizeMessage();
            this._appEvent.close();
            throw new Error('Session token mismatch');
        }

        return true;
    }
}