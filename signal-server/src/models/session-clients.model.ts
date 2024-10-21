import {Client} from "./clients-session.model";

export interface SessionClients {
    sessionToken: string;
    clients: Client[];
}