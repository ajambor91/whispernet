class Config {
    private static _instance: Config;
    private readonly _environment: string;

    private constructor() {
        this._environment = 'dev';

    }

    public get environment(): string {
        return this._environment;
    }

    public static getInstance(): Config {
        if (!this._instance) {
            this._instance = new Config();
        }
        return this._instance
    }

}

export const getEnvirnment = () => Config.getInstance().environment;
export const isProduction = () => Config.getInstance().environment === 'prod';