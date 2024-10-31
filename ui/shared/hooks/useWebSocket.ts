'use client';
import { useEffect } from "react";
import { WSMessage, WSSignalMessage } from "../models/ws-message.model";
import { getRTCConnection } from "../singleton/rtc-connection.singleton";
import { IRTCConnection } from "../interfaces/rtc-connection.model.interface";
import {IAuth} from "../interfaces/auth.interface";
import {getAuth} from "../singleton/auth.singleton";
import {IPingPong} from "../interfaces/ping-pong.interface";
import {getPingPong} from "../singleton/ping-pong.singleton";

const useWebSocket = () => {
    const rtcConnection: IRTCConnection = getRTCConnection();
    const pingPong: IPingPong = getPingPong();
    const auth: IAuth = getAuth();
    const sendMessage = (message: WSMessage | WSSignalMessage): void => {
        auth.authorize(message as WSMessage)
    };
    useEffect(() => {
        pingPong.handlePing();
        rtcConnection.handleMessage();
    }, [pingPong, rtcConnection]);

    return { sendMessage };
};

export default useWebSocket;
