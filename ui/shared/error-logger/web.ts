import {ELokiLogs} from "../enums/loki-logs.enum";

class WebErrorLogger {
    private readonly _lokiAddr: string = '/api/log/loki/api/v1/push';
    private static _instance: WebErrorLogger;

    private constructor() {
        if (!window.onerror) {
            window.onerror = this.logError.bind(this);
        }
        if (!window.onunhandledrejection) {
            window.onunhandledrejection = this.logPromiseRejection.bind(this);
        }
    }

    public static getInstance(): WebErrorLogger {
        if (!this._instance) {
            this._instance = new WebErrorLogger();
        }
        return this._instance;
    }

    public log(level: ELokiLogs, message: string, source: string = "manual", lineno: number = 0, colno: number = 0, error?: Error): void {
        const errorData = {
            message,
            source,
            lineno,
            colno,
            stack: error?.stack || "No stack trace",
        };
        this.sendToLoki(level, errorData);
    }

    private logError( message: string, source: string, lineno: number, colno: number, error: Error): void {
        const errorData = {
            message,
            source,
            lineno,
            colno,
            stack: error?.stack || "No stack trace",
        };
        this.sendToLoki(ELokiLogs.CatchedError, errorData);
    }

    private logPromiseRejection(event: PromiseRejectionEvent): void {
        const errorData = {
            message: "Unhandled Promise Rejection",
            reason: event.reason?.toString() || "No reason provided",
            stack: event.reason?.stack || "No stack trace",
        };
        this.sendToLoki(ELokiLogs.Critical, errorData);
    }

    private async sendToLoki(level: ELokiLogs, data: object): Promise<void> {
        try {
            await fetch(this._lokiAddr, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    streams: [
                        {
                            stream: { level, app: "frontend" },
                            values: [[String(Date.now() * 1e6), JSON.stringify(data)]],
                        },
                    ],
                }),
            });
        } catch (error) {
            console.error("Cannot send error to loki: ", error);
        }
    }

}

export const startCatchingError = () => WebErrorLogger.getInstance();
export const logError = ( message: string, source?: string, lineno?: number, colno?: number, error?: Error) =>
    WebErrorLogger.getInstance().log(ELokiLogs.Error, message, source, lineno, colno, error);

export const logWarn = (message: string, source?: string, lineno?: number, colno?: number, error?: Error) =>
    WebErrorLogger.getInstance().log(ELokiLogs.Warning, message, source, lineno, colno, error);


//TODO add message
export const logInfo = (message: string, source?: string, lineno?: number, colno?: number, error?: Error) =>
    WebErrorLogger.getInstance().log(ELokiLogs.Info, message, source, lineno, colno, error);