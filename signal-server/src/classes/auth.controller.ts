import {AppEvent} from "./base-event.class";
import {WSAuthMessage} from "../models/ws-message.model";
import {getUserManager, UserManager} from "../managers/user-manager";
import {IClient} from "../models/client.model";

export class AuthController {
    private _userManager: UserManager = getUserManager;
    private _userToken: string;
    private _appEvent: AppEvent;
    private _authMessage: WSAuthMessage;
    public constructor(userToken: string, appEvent: AppEvent, authMessage: WSAuthMessage) {
        this._appEvent = appEvent;
        this._userToken = userToken;
        this._authMessage = authMessage;
    }

    public authorize(): void {
        try {
            const user: IClient = this.checkUser();
            this._appEvent.sendAuthorizewMessage(user.session);
        } catch (e) {
            this._appEvent.close();
            if (e instanceof Error) {
                throw e;
            }
            throw new Error("Unknown error during authorization");
        }
    }

    private checkUser(): IClient {
        const user: IClient | undefined = this._userManager.getUser(this._userToken);
        if (!user) {
            throw new Error('User not authorized');
        }
        if (this._authMessage.session && user.session.sessionToken !== this._authMessage.session.sessionToken) {
            throw new Error('Invalid user session');
        } else if (!this._authMessage.session) {
            throw new Error('Session data missing in auth message');
        }
        return user;
    }

}