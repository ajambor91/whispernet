class ErrorHandler {
    private static _instance: ErrorHandler;

    private constructor() {
    }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new ErrorHandler();
        }
        return this._instance;
    }

    public handleError(error: any) {

    }
}