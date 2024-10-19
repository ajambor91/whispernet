'use client'
import React, {useEffect} from "react";
import ChatComponent from "../../../../shared/components/chat/Chat";
import {SessionApiState} from "../../../../shared/slices/createSession.slice";
import {useAppSelector} from "../../../../shared/store/store";
import {useRouter} from "next/navigation";

const Chat: React.FC = () => {
    const sessionApiState: SessionApiState = useAppSelector(state => state.sessionApiState);
    const router = useRouter();
    useEffect(() => {
        if(!sessionApiState || !sessionApiState.sessionToken) {
            router.push('/')
        }
    }, [sessionApiState.sessionToken]);
    return (
        <div>
        <ChatComponent sessionApiState={sessionApiState} />
        </div>
    )
}
export default Chat