class ClientsMap {
    private readonly _clientsMap: Map<string, string[]> = new Map<string, string[]>();
    private static _instance: ClientsMap;


    public static getInstance(): ClientsMap {
        if (!this._instance) {
            this._instance = new ClientsMap();
        }
        return this._instance;
    }

    public setClient(wssession: string, clients: string[]): void  {
        this._clientsMap.set(wssession, clients);
    }
    public getClient(wssession: string): string[] | undefined  {
        return this._clientsMap.get(wssession);
    }
}

export const clientsMap = ClientsMap.getInstance();
