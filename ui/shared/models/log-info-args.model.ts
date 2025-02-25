export interface LogInfoArgs {
    message: string;
    source?: string;
    lineno?: number;
    colno?: number;
    error?: Error;

    [key: string]: any;
}
