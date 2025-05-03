import {IAuthorization} from "../models/authorization.model";

export class AuthGuard {

    private readonly _authorization: IAuthorization;

    constructor(authMessage: IAuthorization) {
        this._authorization = authMessage;
    }

}