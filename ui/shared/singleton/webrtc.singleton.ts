import {ConnectionStateModel} from "../models/connection-state.model";

class WebrtcSingleton {
    private static _instance: WebrtcSingleton;
    private _state!: ConnectionStateModel;

    public static getInstance(): WebrtcSingleton {
        if (!this._instance) {
            this._instance = new WebrtcSingleton();
        }
        return this._instance;
    }

    public get state(): ConnectionStateModel {
        return this._state;
    }

    public set state(state: ConnectionStateModel) {
        // if (Object.isFrozen(this._state)) {
        //     throw new Error("Cannot modify a frozen state.");
        // }
        this._state = state;
    }
}

export const setConnectionState = (state: ConnectionStateModel): void => {
    console.log("state", state)
    WebrtcSingleton.getInstance().state = state;
    // Object.freeze(WebrtcSingleton.getInstance().state);

}

export const getConnectionsState = (): ConnectionStateModel => {
    return WebrtcSingleton.getInstance().state;
}

export const sendWebRTCMessage = (content: string) => {
    const instance = WebrtcSingleton?.getInstance();
    if (instance?.state?.dataChannel) {
        instance.state.dataChannel.send(content);
    } else {
        console.error("Data channel is not available.");
    }
}

export const getWebRTCDataChannel = () => {
    return WebrtcSingleton.getInstance().state?.dataChannel;
}