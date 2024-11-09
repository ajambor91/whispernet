import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useNewChat from "../../../../../shared/hooks/useNewChat";
import Centered from "../../../../../shared/components/elements/centered/Centered";
import Header from "../../../../../shared/components/header/Header";
import ChatActions from "../../../../../shared/components/chat-actions/ChatActions";
import {
    IPeerState,
    setCreatePeerState
} from "../../../../../shared/slices/createSession.slice";
import { logInfo, logError } from "../../../../../shared/error-logger/web";

export default function Home() {
    const { createNewChat, response, error, loading } = useNewChat();
    const router = useNavigate();
    const dispatch = useDispatch();

    const goToWaitingPage = () => {
        logInfo({ message: "Navigating to waiting page" });
        router('/waiting');
    };

    const goToJoiningPage = () => {
        logInfo({ message: "Navigating to joining page" });
        router('/join');
    };

    useEffect(() => {
        logInfo({ message: "Home component mounted" });

        dispatch(setCreatePeerState({
            session: response ? response.session : null,
            peerRole: response ? response.peerRole : null
        }));

        if (response && !error) {
            logInfo({ message: "Received response from createNewChat", response });
            goToWaitingPage();
        }

        if (error) {
            logError({ message: "Error in createNewChat", error });
        }

        return () => {
            logInfo({ message: "Home component unmounted" });
        };
    }, [response, error, loading]);

    const handleNewChatClick = async () => {
        logInfo({ message: "New chat button clicked" });

        dispatch(setCreatePeerState({
            sessionToken: null,
            error: null,
            loading: true
        } as IPeerState));

        try {
            await createNewChat();
            logInfo({ message: "createNewChat called successfully" });
        } catch (err) {
            logError({ message: "Error calling createNewChat", error: err });
        }
    };

    const handleJoinChatClick = () => {
        logInfo({ message: "Join chat button clicked" });
        goToJoiningPage();
    };

    return (
        <div>
            <Centered>
                <Header />
                <ChatActions
                    onChatJoin={handleJoinChatClick}
                    onChatCreate={handleNewChatClick}
                    loading={loading}
                />
            </Centered>
        </div>
    );
}
