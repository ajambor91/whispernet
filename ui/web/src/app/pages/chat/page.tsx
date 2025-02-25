'use client'
import React, {useEffect} from "react";
import ChatComponent from "../../../../../shared/components/chat/Chat";
import {IPeerState} from "../../../../../shared/slices/createSession.slice";
import {useAppSelector} from "../../../../../shared/store/store";
import '../../../../../shared/styles/globals.scss';
import {useNavigate} from "react-router-dom";
import TertiaryHeader from "../../../../../shared/components/elements/tertiary-header/TertiaryHeader";
import useWebSocket from "../../../../../shared/hooks/useWebSocket";
import {useToasts} from "../../../../../shared/providers/toast-provider";

const Chat: React.FC = () => {
    const peerState: IPeerState = useAppSelector(state => state?.peerState);
    const router = useNavigate();
    const {onSessionInfo} = useWebSocket();
    const {addToast} = useToasts();
    useEffect(() => {
        if (onSessionInfo) {
            onSessionInfo(data => {
                addToast({
                    type: "info",
                    description: data,
                    title: "Session info",
                    autoClose: true
                });
            })
        }
    }, [onSessionInfo]);

    useEffect(() => {
        if (!peerState || !peerState.sessionToken) {
            router('/');
        }
    }, [peerState, router]);

    return (
        peerState.sessionToken ? (
            <div className="full-screen">
                <ChatComponent peerState={peerState}/>
            </div>
        ) : (
            <TertiaryHeader/>
        )
    );
}

export default Chat;
