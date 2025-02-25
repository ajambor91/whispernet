import {ISession} from "../models/session.model";
import {Session} from "./session";

export interface SessionManager {
    addSession: (session: ISession) => void;
    isExists: (session: ISession) => boolean;
    getSession: (session: ISession) => Session | null;
    removeSession: (session: ISession) => void;
}

const sessionMap: Map<String, Session> = new Map<String, Session>();

const createSessionManager = (): SessionManager => {
    return {
        addSession: (session: ISession) => {
            if (!sessionMap.has(session.sessionToken)) {
                sessionMap.set(session.sessionToken, new Session(session));
            }
        },
        isExists: (session: ISession) => sessionMap.has(session.sessionToken),

        getSession: (session: ISession) => {
            if (!sessionMap.has(session.sessionToken)) {
                return null;
            }
            return sessionMap.get(session.sessionToken) as Session;
        },
        removeSession: (session: ISession) => {
            sessionMap.delete(session.sessionToken);
        }
    }
}

export const sessionManager = createSessionManager();