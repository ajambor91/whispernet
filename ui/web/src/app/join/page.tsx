'use client'

import React from "react";
import useJoinChat from "../../../../shared/hooks/useJoinChat";
import JoinChat from "../../../../shared/components/join-chat/JoinChat";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {setWSession} from "../../../../shared/slices/wsession";

const ChatJoining: React.FC = () => {
    const router = useRouter();
    const {joinChat} = useJoinChat();
    const dispatch = useDispatch();
    const navigateToWaiting = () => {
        router.push('/waiting-join');

    }
    const onChatSubmit = async (hash: string) => {
        const data = await joinChat(hash);
        console.log('subtmi',data)
        if (data) {
            dispatch(setWSession(data));

            navigateToWaiting();
        }
    }
    return (
        <section>
            <JoinChat onChatSubmit={onChatSubmit}></JoinChat>
        </section>
    )
}

export default ChatJoining;