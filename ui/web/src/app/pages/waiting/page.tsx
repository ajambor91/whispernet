import React, { useEffect, useState } from 'react';
import { useAppSelector } from "../../../../../shared/store/store";
import useWebSocket from "../../../../../shared/hooks/useWebSocket";
import { IPeerState } from "../../../../../shared/slices/createSession.slice";
import Hash from "../../../../../shared/components/hash/Hash";
import {logInfo, logWarning} from "../../../../../shared/error-logger/web";
import {EClientStatus} from "../../../../../shared/enums/client-status.enum";
import {useNavigate} from "react-router-dom";
import TertiaryHeader from "../../../../../shared/components/elements/tertiary-header/TertiaryHeader";
import Centered from "../../../../../shared/components/elements/centered/Centered";
import {useToasts} from "../../../../../shared/providers/toast-provider";

const ChatWaiting: React.FC = () => {
    const {addToast} = useToasts();
    const [status, setStatus] = useState<string>("Connecting");
    const peerState: IPeerState = useAppSelector(state => state?.peerState);
    const {onStatus} = useWebSocket(peerState);
    const router = useNavigate();
    useEffect(() => {
        logInfo({ message: "ChatWaiting component mounted" });
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
            logInfo({ message: "ChatWaiting component unmounted" });
        };
    }, []);

    useEffect(() => {
        if (!peerState || !peerState.sessionToken) {
            addToast({
                title: "Info",
                type: "info",
                autoClose: true,
                description: "Session data is empty"
            })
            logWarning({message: "Session data in waiting is empty. Redirecting"});
            setTimeout(() => {
                router("/")

            }, 1500);
        }
    }, [peerState]);
    return (
        peerState.sessionToken ? (
            <section className="full-screen">
                <Hash peerState={peerState} sessionStatus={status}/>
            </section>
        ) : (<TertiaryHeader>
            <Centered>
                <TertiaryHeader>        Redirecting
                </TertiaryHeader>
            </Centered>
        </TertiaryHeader>)

    );
}

export default ChatWaiting;
