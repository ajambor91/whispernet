export interface IRTCIceServer {
    urls: string | string[];
    username?: string;
    credential?: string;
    credentialType?: 'password';
}
