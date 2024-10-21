import {Client} from "../models/clients-session.model";
import {SessionClients} from "../models/session-clients.model";

class ClientsMap {
    private readonly _clientsMap: Map<string, Client[]> = new Map<string, Client[]>();
    private static _instance: ClientsMap;


    public static getInstance(): ClientsMap {
        if (!this._instance) {
            this._instance = new ClientsMap();
        }
        return this._instance;
    }

    public setClient(sessionClients: SessionClients): void  {
        this._clientsMap.set(sessionClients.sessionToken, sessionClients.clients);
    }
    public getClient(sessionToken: string): Client[] | undefined  {
        return this._clientsMap.get(sessionToken);
    }
}

export const clientsMap = ClientsMap.getInstance();
