'use client'

import React, {useEffect} from "react";
import useJoinChat from "../../../../shared/hooks/useJoinChat";
import JoinChat from "../../../../shared/components/join-chat/JoinChat";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {
    IPeerState,
    setCreatePeerState,
} from "../../../../shared/slices/createSession.slice";
import Centered from "../../../../shared/components/centered/Centered";

const ChatJoining: React.FC = () => {
    const router = useRouter();
    const {joinChat, response} = useJoinChat();
    const dispatch = useDispatch();
    const navigateToWaiting = () => {
        router.push('/waiting-join');

    }
    useEffect(() => {
        if (response) {
            dispatch(setCreatePeerState(response));
            navigateToWaiting();
        }

        return () => {
        }
    }, [response]);
    const onChatSubmit = async (hash: string) => {
        dispatch(setCreatePeerState({
            session: null,
            peerRole: null
        } as IPeerState));
        await joinChat(hash);

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