'use client'
import {Ref, useEffect, useRef, useState} from "react";

const useWebSocket = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef: Ref<WebSocket | null> = useRef<WebSocket | null>(null);

    const sendToken = (token: string) => {
        if(socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(token);
        }
    }

    useEffect(() => {
        socketRef.current = new WebSocket('/api/signal');
        socketRef.current.onopen = () => {
            console.log('connect');
            setIsConnected(true)
        }

        socketRef.current.onmessage = (event: MessageEvent) => {
            console.log(event);
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    });
    return { isConnected, messages, sendToken };
}
export default useWebSocket;