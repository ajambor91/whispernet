import {IClient} from "../models/client.model";


export type SessionManager = { getClients: () => IClient[], addClient: (client: IClient) => void, getClient: (userToken: string) => IClient, setClient: (client: IClient) => void }
export const sessionMap: Map<string, SessionManager> = new Map();

export const createSessionManager = (): SessionManager => {
    let clients: IClient[] = [];

    return {
        getClients: (): IClient[] => clients,
        addClient: (client: IClient): void => {
            if (!clients.some(existingClient => existingClient.userToken === client.userToken)) {
                clients.push(client);
            }
        },
        getClient: (userToken: string) => {
            const client: IClient | undefined = clients.find(client => client.userToken === userToken)
            if (!client) {
                throw new Error('Client not found!');
            }
            return client;

        },
        setClient: (client: IClient) => {
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