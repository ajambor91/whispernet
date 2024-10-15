'use client'

import React, {useEffect} from "react";
import useJoinChat from "../../../../shared/hooks/useJoinChat";
import JoinChat from "../../../../shared/components/join-chat/JoinChat";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {SessionApiState, setCreateSession} from "../../../../shared/slices/createSession.slice";

const ChatJoining: React.FC = () => {
    const router = useRouter();
    const {joinChat, response, loading, error} = useJoinChat();
    const dispatch = useDispatch();
    const navigateToWaiting = () => {
        router.push('/waiting-join');

    }
    useEffect(() => {
            if (response) {
                dispatch(setCreateSession({
                    sessionToken: response ? response.sessionToken : null,
                    error: error,
                    loading: loading
                }));
                navigateToWaiting();
            }

        return () => {
        }
    }, [response]);
    const onChatSubmit = async (hash: string) => {
        dispatch(setCreateSession({
            sessionToken: null,
            error: null,
            loading: true
        } as SessionApiState));
        await joinChat(hash);

    }
    return (
        <section>
            <JoinChat onChatSubmit={onChatSubmit}></JoinChat>
        </section>
    )
}

export default ChatJoining;