import {ELokiLogs} from "../enums/loki-logs.enum";
import http from 'http'
import {isProduction} from "../config/config";

class ErrorLooger {
    private static _instance: ErrorLooger;
    private readonly _lokiAddr: string = 'loki'
    private readonly _lokiPort: number = 3100;
    private readonly _lokiPath: string = '/loki/api/v1/push'
    private readonly _appName: string = 'websocket'
    private constructor() {
    }

    private readonly request = http.request;

    public static getInstance(): ErrorLooger {
        if (!this._instance) {
            this._instance = new ErrorLooger();
        }
        return this._instance;
    }

    public logError(data: object): void {
        if (!isProduction()) {
            console.error(ELokiLogs.Error, data);
        }
        this.sendToLoki(ELokiLogs.Error, data)
    }

    public logWarning(data: object): void {
        if (!isProduction()) {
            console.warn(ELokiLogs.Warning, data)

        }
        this.sendToLoki(ELokiLogs.Warning, data)
    }

    public logInfo(data: object): void {
        if (!isProduction()) {
            console.log(ELokiLogs.Info, data)
        }
        this.sendToLoki(ELokiLogs.Info, data)
    }

    private _prepareLogPayload(level: ELokiLogs, data: Record<string, any>): string {
        return JSON.stringify({
            streams: [
                {
                    stream: { level, app: this._appName },
                    values: [[`${Date.now()}000000`, JSON.stringify(data)]],
                },
            ],
        });
    }
    private async sendToLoki(level: ELokiLogs, data: object): Promise<void> {
        const payload: string = this._prepareLogPayload(level, data);

        try {
            return new Promise((resolve, reject) => {
                const req = this.request({
                    hostname: this._lokiAddr,
                    path: this._lokiPath,
                    port: this._lokiPort,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(payload)
                    },
                }, res => {
                    res.on('end', resolve);
                })
                req.write(payload);
                req.on('error', (err) => {
                    console.error("Cannot send error to loki: ", err);
                    reject()
                } )
                req.end();
            });

        } catch (error) {
            console.error("Cannot send error to loki: ", error);
        }
    }
}

export const logWarning = (data: object) => {
    ErrorLooger.getInstance().logWarning(data)
}

export const logError = (data: object) => {
    ErrorLooger.getInstance().logError(data)
}

export const logInfo = (data: object) => {
    ErrorLooger.getInstance().logInfo(data)
}