import { ELokiLogs } from "../enums/loki-logs.enum";
import { isProduction } from "../config/config";
import {LogInfoArgs} from "../models/error.model";

class WebErrorLogger {
    private static _instance: WebErrorLogger;
    private readonly _lokiAddr: string = '/api/log/loki/api/v1/push';
    private readonly _appName: string = 'frontend';

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

    public logError({ message, source = "window", lineno = 0, colno = 0, error }:
                        { message: string; source?: string; lineno?: number; colno?: number; error?: Error }): void {
        const errorData = this._formatLogData(message, source, lineno, colno, error);
        if (!isProduction()) {
            console.error(ELokiLogs.CatchedError, errorData);
        }
        this.sendToLoki(ELokiLogs.CatchedError, errorData);
    }

    public logWarning({ message, source = "window", lineno = 0, colno = 0, error }:
                          { message: string; source?: string; lineno?: number; colno?: number; error?: Error }): void {
        const errorData = this._formatLogData(message, source, lineno, colno, error);
        if (!isProduction()) {
            console.warn(ELokiLogs.Warning, errorData);
        }
        this.sendToLoki(ELokiLogs.Warning, errorData);
    }

    public logInfo(args: LogInfoArgs): void {
        const { message, source = "window", lineno = 0, colno = 0, error } = args;
        const errorData = this._formatLogData(message, source, lineno, colno, error);
        if (!isProduction()) {
            console.log(ELokiLogs.Info, errorData);
        }
        this.sendToLoki(ELokiLogs.Info, errorData);
    }

    private logPromiseRejection(event: PromiseRejectionEvent): void {
        const errorData = {
            message: "Unhandled Promise Rejection",
            reason: event.reason?.toString() || "No reason provided",
            stack: event.reason?.stack || "No stack trace",
        };
        if (!isProduction()) {
            console.error(ELokiLogs.Critical, errorData);
        }
        this.sendToLoki(ELokiLogs.Critical, errorData);
    }

    private _formatLogData(message: string, source: string, lineno: number, colno: number, error?: Error) {
        return {
            message,
            source,
            lineno,
            colno,
            stack: error?.stack || "No stack trace",
        };
    }

    private async sendToLoki(level: ELokiLogs, data: object): Promise<void> {
        const payload = JSON.stringify({
            streams: [
                {
                    stream: { level, app: this._appName },
                    values: [[`${Date.now()}000000`, JSON.stringify(data)]],
                },
            ],
        });

        try {
            await fetch(this._lokiAddr, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: payload,
            });
        } catch (error) {
            console.error("Cannot send error to loki: ", error);
        }
    }
}

export const startCatchingError = () => WebErrorLogger.getInstance();

export const logError = (args: { message: string; source?: string; lineno?: number; colno?: number; error?: Error }) =>
    WebErrorLogger.getInstance().logError(args);

export const logWarning = (args: { message: string; source?: string; lineno?: number; colno?: number; error?: Error }) =>
    WebErrorLogger.getInstance().logWarning(args);

export const logInfo = (args: LogInfoArgs) =>
    WebErrorLogger.getInstance().logInfo(args);
