'use client'
import React, {useEffect, useState} from 'react';
import {useAppSelector} from "../../../../shared/store/store";
import useWebSocket from "../../../../shared/hooks/useWebSocket";
import  {SessionApiState} from "../../../../shared/slices/createSession.slice";
import {WebRTCMessageEnum} from "../../../../shared/enums/webrtc-message-enum";
import {useRouter} from "next/navigation";
import Hash from "../../../../shared/components/hash/Hash";
const ChatWaiting: React.FC = () => {
    const [messageSent, setMessageSent] = useState<boolean>(false)

    const sessionApiState: SessionApiState = useAppSelector(state => state.sessionApiState);
    const {  sendMessage, isConnected, isJoined, isLoading } = useWebSocket();
    const router = useRouter();
    useEffect(() => {
        if (sessionApiState.sessionToken && !messageSent) {
            sendMessage({sessionId: sessionApiState.sessionToken, type: WebRTCMessageEnum.Init})
            setMessageSent(true)

        } else  {
            router.push('/')
        }
    }, [sessionApiState.sessionToken]);

    useEffect(() => {
        if (isJoined) {
            setTimeout(() => {
                router.push('/chat')

            },1500)        }
    }, [isJoined]);
    return (
        <section className="full-screen">
            <Hash sessionApiState={sessionApiState} isLoading={isLoading} isConnected={isConnected} isJoined={isJoined} />
        </section>
    )
}
export default ChatWaiting;