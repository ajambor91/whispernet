export const clientsMap: Map<string, string[]> = new Map<string, string[]>();

export const setClient = (wssession: string, clients: string[]): void  => {
    clientsMap.set(wssession, clients);
}
export const getClient = (wssession: string): string[] | undefined => {
    return clientsMap.get(wssession);
}