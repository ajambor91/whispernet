export interface ILoginMessage {
    username: string;
    message: string;
    signedMessage?: string;
    signedMessageFile?: string;
}