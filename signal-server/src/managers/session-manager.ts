import {SessionController} from "../controllers/session-controller";
import {logWarning} from "../error-logger/error-looger";


export type SessionManager = {
    getSessions: () => SessionController[],
    getSession: (sessionToken: string) => SessionController | undefined,
    addSession: (sessionToken: string, sessionController: SessionController) => void,
    removeSession: (sessionToken: string) => void
}
export const sessionMap: Map<string, SessionController> = new Map();

const createSessionManager = (): SessionManager => {
    return  {
        getSession: (sessionToken: string)  => sessionMap.get(sessionToken),
        getSessions: () => Array.from(sessionMap.values()) as SessionController[],
        addSession: (sessionToken: string, sessionController: SessionController) => {
            if (!sessionMap.has(sessionToken)) {
                sessionMap.set(sessionToken, sessionController)
            }
        },
        removeSession: (sessionToken: string) => {
          if (!sessionMap.has(sessionToken)) {
              logWarning({event: "removeSession", message: "Session no found", sessionToken: sessionToken})
          } else  {
              sessionMap.delete(sessionToken)
          }
        }
    }
};

export const getSessionManager =  createSessionManager();