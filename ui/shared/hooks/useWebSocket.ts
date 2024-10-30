'use client'
import {useEffect, useRef, useState} from "react";
import {WSMessage, WSMessage} from "../models/ws-message.model";
import {connectRTC} from "../webrtc/functions";
import {WsMessageEnum} from "../enums/ws-message.enum";

const useWebSocket = () => {
    // const [message, setMessage] = useState<string>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isJoined, setIsJoined] = useState<boolean>(false)
    const socketRef = useRef<WebSocket>({} as WebSocket);
    const actionForMessage = connectRTC()
    const closeConnection = () => {
        socketRef.current.close();
    }
    const decodeBinaryMessage = (msg: MessageEvent): Promise<WSMessage> => {
        return new Promise((resolve, reject) => {
            const blob: Blob = msg.data;
            const fileReader: FileReader = new FileReader();
            fileReader.onload = () => {
                if (fileReader.result instanceof ArrayBuffer) {
                    const arrBuffer: ArrayBuffer = fileReader.result;
                    const byteArr: Uint8Array = new Uint8Array(arrBuffer);
                    const decodedMessage = new TextDecoder().decode(byteArr);
                    const WSMessage: WSMessage = JSON.parse(decodedMessage);
                    resolve(WSMessage);
                } else {
                    reject(new Error("Niepoprawny format danych"));
                }
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
            if (blob instanceof Blob) {
                fileReader.readAsArrayBuffer(blob);

            } else {
                resolve(JSON.parse(msg.data))
            }
        });
    };
    const sendMessage = (message: WSMessage): boolean | undefined=> {
        if (message.type === WsMessageEnum.Ready) {
            setIsJoined(true);
            return true;
        }
        const ws: WebSocket = socketRef.current;
        console.log("SEND MESSAGE", message)
        actionForMessage(message, ws)
    }

    useEffect(() => {
        setIsLoading(true)
        socketRef.current = new WebSocket('/api/signal');
        socketRef.current.onopen = () => {
            setIsConnected(true)
        }

        socketRef.current.onmessage = async (event: MessageEvent) => {
            const message: WSMessage = await decodeBinaryMessage(event);
            sendMessage(message);
        }

    },[]);


    return {isLoading, isConnected,isJoined, sendMessage, closeConnection };
}
export default useWebSocket;