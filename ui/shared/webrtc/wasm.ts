import Module from '../wasm/main.js';
export class MessageEncoder {

    private _module: any;
    private _mainInstance: any;
    private _isInitialized: boolean = false;

    private async initialize(): Promise<void> {
        this._isInitialized = true;
        this._module = await new Module({
            locateFile: (path: string) => '/wasm/main.wasm'
        });
        this._mainInstance = new this._module.Main();
    }
    public async encodeMessage(message: string): Promise<string> {
        if (!this._isInitialized) {
            await this.initialize();
            return this._mainInstance.encodeMessage(message);
        }
        return this._mainInstance.encodeMessage(message);
    }
}
