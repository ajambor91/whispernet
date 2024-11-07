// import { SessionController} from "../classes/session.controller";
import {SessionController} from "../controllers/session-controller";


export type SessionManager = { getSessions: () => SessionController[], getSession: (sessionToken: string) => SessionController | undefined, addSession: (sessionToken: string, sessionController: SessionController) => void }
export const sessionMap: Map<string, SessionController> = new Map();

const createSessionManager = (): SessionManager => {
    return  {
        getSession: (sessionToken: string)  => sessionMap.get(sessionToken),
        getSessions: () => Array.from(sessionMap.values()) as SessionController[],
        addSession: (sessionToken: string, sessionController: SessionController) => {
            if (!sessionMap.has(sessionToken)) {
                sessionMap.set(sessionToken, sessionController)
            }
        }
    }
};

export const getSessionManager =  createSessionManager();