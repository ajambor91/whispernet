import Module from '../wasm/main.js';
import {IWasmDecoded} from "../models/wasm-decoded.model";
import {IWasmEncoded} from "../models/wasm-encoded.model";
export class MessageEncoder {

    private _module: any;
    private _mainInstance: any;
    private _isInitialized: boolean = false;
    private _secret;
    constructor(secret: string) {
        this._secret = secret;
        this.initialize();
    }
    private async initialize(): Promise<void> {
        this._isInitialized = true;
        this._module = await new Module({
            locateFile: (path: string) => '/wasm/main.wasm'
        });
        this._mainInstance = new this._module.Main(this._secret);
    }
    public encodeMessage(message: string): IWasmEncoded{
        if (!this._isInitialized) {
            throw new Error("WASM is not initialized");
        }
        return JSON.parse(this._mainInstance.encodeMessage(message));
    }

    public decodeMessage(encodedMessage: string, iv: string): IWasmDecoded {
        if (!this._isInitialized) {
            throw new Error("WASM is not initialized");
        }
        return JSON.parse(this._mainInstance.decodeMessage(encodedMessage, iv));
    }
}
