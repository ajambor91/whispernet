import {Client} from "./client.model";

export interface SenderReceiver {
    sender: Client;
    receivers: Client[];
}