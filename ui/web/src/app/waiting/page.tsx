import React, { useEffect, useState } from 'react';
import { useAppSelector } from "../../../../shared/store/store";
import useWebSocket from "../../../../shared/hooks/useWebSocket";
import { IPeerState } from "../../../../shared/slices/createSession.slice";
import Hash from "../../../../shared/components/hash/Hash";
import { logInfo } from "../../../../shared/error-logger/web";

const ChatWaiting: React.FC = () => {
    const [status, setStatus] = useState<string>("Connecting");
    const peerState: IPeerState = useAppSelector(state => state?.peerState);
    const onStatus = useWebSocket(peerState);

    useEffect(() => {
        logInfo({ message: "ChatWaiting component mounted" });

        if (onStatus) {
            logInfo({ message: "WebSocket status listener initialized" });
            onStatus(data => {
                logInfo({ message: "Status updated", newStatus: data });
                setStatus(data);
            });
        } else {
            logInfo({ message: "No WebSocket listener available" });
        }

        return () => {
            logInfo({ message: "ChatWaiting component unmounted" });
        };
    }, [onStatus]);

    return (
        <section className="full-screen">
            <Hash peerState={peerState} sessionStatus={status} />
            <h1>STATUS {status}</h1>
        </section>
    );
}

export default ChatWaiting;
