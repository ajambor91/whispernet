import * as process from "process";

class Config {
    private static _instance: Config;

    private constructor() {
        this._environment = process.env.ENVIRONMENT || "dev"
    }

    private _environment: string;

    public get environment(): string {
        return this._environment
    }

    public static getInstance(): Config {
        if (!this._instance) {
            this._instance = new Config();
        }
        return this._instance;
    }

}

export const getEnvironment = () => Config.getInstance().environment;

export const isProduction = () => Config.getInstance().environment === 'prod';