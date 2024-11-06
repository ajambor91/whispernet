import {IClient, IInitialClient} from "../models/client.model";


export type SessionManager = { getClients: () => IInitialClient[], addClient: (client: IInitialClient) => void, getClient: (userToken: string) => IInitialClient, setClient: (client: IInitialClient) => void }
export const sessionMap: Map<string, SessionManager> = new Map();

export const createSessionManager = (): SessionManager => {
    let clients: IInitialClient[] = [];

    return {
        getClients: (): IInitialClient[] => clients,
        addClient: (client: IInitialClient): void => {
            if (!clients.some(existingClient => existingClient.userToken === client.userToken)) {
                clients.push(client);
            }
        },
        getClient: (userToken: string) => {
            const client: IInitialClient | undefined = clients.find(client => client.userToken === userToken)
            if (!client) {
                throw new Error('Client not found!');
            }
            return client;

        },
        setClient: (client: IInitialClient) => {
            const index: number = clients.findIndex(existingClient => existingClient.userToken === client.userToken);
            if (index >= 0 ) {
                clients[index] = client;
            }
        }
    };
};

export const getSessionManager = (sessionId: string): SessionManager => {
    let sessionManager: SessionManager | undefined = sessionMap.get(sessionId);
    if (!sessionManager) {
        sessionManager = createSessionManager();
        sessionMap.set(sessionId, sessionManager)
    }
    return sessionManager;
}