import React, { useEffect, useState } from 'react';
import { useAppSelector } from "../../../../../shared/store/store";
import useWebSocket from "../../../../../shared/hooks/useWebSocket";
import { IPeerState } from "../../../../../shared/slices/createSession.slice";
import Status from "../../../../../shared/components/status/Status";
import Indicator from "../../../../../shared/components/indicator/Indicator";
import Centered from "../../../../../shared/components/elements/centered/Centered";
import { logInfo } from "../../../../../shared/error-logger/web";
import {EClientStatus} from "../../../../../shared/enums/client-status.enum";
import {useNavigate} from "react-router-dom";

const ChatWaitingJoin: React.FC = () => {
    const [status, setStatus] = useState<string>("Connecting");
    const peerState: IPeerState = useAppSelector(state => state.peerState);
    const {onStatus} = useWebSocket(peerState);
    const router = useNavigate();
    useEffect(() => {
        logInfo({ message: "ChatWaitingJoin component mounted" });

        if (onStatus) {
            logInfo({ message: "WebSocket status listener initialized" });
            onStatus(data => {
                logInfo({ message: "Status updated", newStatus: data });

                setStatus(data);
                if (data === EClientStatus.PeersConnected) {
                    setTimeout(() => {
                        router('/chat')
                    }, 200)
                }
            });
        } else {
            logInfo({ message: "No WebSocket listener available" });
        }

        return () => {
            logInfo({ message: "ChatWaitingJoin component unmounted" });
        };
    }, []);

    return (
        <section>
            <Centered>
                <div>
                    <Indicator />
                    <Status sessionStatus={status} />
                </div>
            </Centered>
        </section>
    );
}

export default ChatWaitingJoin;
