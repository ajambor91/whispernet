import {Client} from "../models/client.model";


export type SessionManager = { getClients: () => Client[], addClient: (client: Client) => void, getClient: (userToken: string) => Client, setClient: (client: Client) => void }
export const sessionMap: Map<string, SessionManager> = new Map();

export const createSessionManager = (): SessionManager => {
    let clients: Client[] = [];

    return {
        getClients: (): Client[] => clients,
        addClient: (client: Client): void => {
            if (!clients.some(existingClient => existingClient.userToken === client.userToken)) {
                clients.push(client);
            }
        },
        getClient: (userToken: string) => {
            const client: Client | undefined = clients.find(client => client.userToken === userToken)
            if (!client) {
                throw new Error('Client not found!');
            }
            return client;

        },
        setClient: (client: Client) => {
            const index: number = clients.findIndex(existingClient => existingClient.userToken === client.userToken);
            if (index >= 0 ) {
                clients[index] = client;
            }
        }
    };
};