'use client'
import {MutableRefObject, Ref, useEffect, useRef, useState} from "react";

const useWebSocket = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    const sendToken = (token: string) => {
        setIsLoading(true)
        if(socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(token);
        }
    }

    useEffect(() => {
        socketRef.current = new WebSocket('/api/signal');
        socketRef.current.onopen = () => {
            setIsLoading(true)
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
    return {isLoading, isConnected, messages, sendToken };
}
export default useWebSocket;