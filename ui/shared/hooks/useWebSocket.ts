'use client'
import {MutableRefObject, Ref, useEffect, useRef, useState} from "react";

const useWebSocket = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const sendToken = (token: string) => {
        console.log("SEND TOKEN",socketRef.current?.readyState)
        setIsLoading(true)
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(token);
            console.log("Token sent successfully");
        } else {
            console.log("WebSocket is not open yet, retrying...");
            // Możemy spróbować wysłać token ponownie po chwili
            const interval = setInterval(() => {
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(token);
                    console.log("Token sent successfully after retry");
                    clearInterval(interval); // Po wysłaniu usuwamy interval
                }
            }, 100);  // Sprawdzamy co 100ms, czy połączenie jest gotowe
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