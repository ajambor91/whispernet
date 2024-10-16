'use client'
import {MutableRefObject, Ref, useEffect, useRef, useState} from "react";

const useWebSocket = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [waiting, setWaiting] = useState<string>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const decodeBinaryMessage = (msg: MessageEvent) => {
        const blob: Blob = msg.data;
        let decodedMessage: string;
        const fileReader: FileReader = new FileReader();
        fileReader.onload = () => {
            if (!!fileReader.result &&  fileReader.result instanceof ArrayBuffer) {
                const arrBuffer: ArrayBuffer = fileReader.result;
                const byteArr: Uint8Array = new Uint8Array(arrBuffer);
                decodedMessage = new TextDecoder().decode(byteArr);
                setWaiting(decodedMessage);

            }
        }
        fileReader.readAsArrayBuffer(blob)
    }
    const sendToken = (token: string) => {
        setIsLoading(true)
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(token);
        } else {
            const interval = setInterval(() => {
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(token);
                    console.log("Token sent successfully after retry");
                    clearInterval(interval);
                }
            }, 100);
        }
    }

    useEffect(() => {
        socketRef.current = new WebSocket('/api/signal');
        socketRef.current.onopen = () => {
            console.log("OPEN")
            setIsLoading(true)
            setIsConnected(true)
        }

        socketRef.current.onmessage = (event: MessageEvent) => {
            console.log('onmessage',event);
            decodeBinaryMessage(event);
        }

        // return () => {
        //     if (socketRef.current) {
        //         console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        //         socketRef.current.close();
        //     }
        // };
    });
    return {isLoading, isConnected, messages, sendToken, waiting };
}
export default useWebSocket;