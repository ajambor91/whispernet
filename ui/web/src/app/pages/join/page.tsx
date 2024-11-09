import React, { useEffect } from "react";
import useJoinChat from "../../../../../shared/hooks/useJoinChat";
import JoinChat from "../../../../../shared/components/join-chat/JoinChat";
import { useDispatch } from "react-redux";
import {
    IPeerState,
    setCreatePeerState,
} from "../../../../../shared/slices/createSession.slice";
import Centered from "../../../../../shared/components/elements/centered/Centered";
import { useNavigate } from "react-router-dom";
import { logInfo, logError } from "../../../../../shared/error-logger/web";

const ChatJoining: React.FC = () => {
    const router = useNavigate();
    const { joinChat, response } = useJoinChat();
    const dispatch = useDispatch();

    const navigateToWaiting = () => {
        logInfo({ message: "Navigating to waiting join page" });
        router('/waiting-join');
    }

    useEffect(() => {
        logInfo({ message: "ChatJoining component mounted" });

        if (response) {
            logInfo({ message: "Received response from joinChat", response });
            dispatch(setCreatePeerState(response));
            navigateToWaiting();
        }

        return () => {
            logInfo({ message: "ChatJoining component unmounted" });
        }
    }, [response]);

    const onChatSubmit = async (hash: string) => {
        logInfo({ message: "Submitting chat join request", hash });
        dispatch(setCreatePeerState({
            session: null,
            peerRole: null
        } as IPeerState));

        try {
            await joinChat(hash);
            logInfo({ message: "joinChat called successfully" });
        } catch (error) {
            logError({ message: "Error in joinChat", error });
        }
    }

    return (
        <section className="full-screen">
            <Centered>
                <JoinChat onChatSubmit={onChatSubmit}></JoinChat>
            </Centered>
        </section>
    )
}

export default ChatJoining;
