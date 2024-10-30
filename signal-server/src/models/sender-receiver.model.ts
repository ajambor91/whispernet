import { IClient} from "./client.model";

export interface SenderReceiver {
    sender: IClient;
    receivers: IClient[];
}