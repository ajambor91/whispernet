'use client'
import React, {useEffect, useState} from 'react';
import {useAppSelector} from "../../../../shared/store/store";
import useWebSocket from "../../../../shared/hooks/useWebSocket";
import {SessionApiState} from "../../../../shared/slices/createSession.slice";
import {WebRTCMessageEnum} from "../../../../shared/enums/webrtc-message-enum";
import {useRouter} from "next/navigation";
import Status from "../../../../shared/components/status/Status";
import Indicator from "../../../../shared/components/indicator/Indicator";
import Centered from "../../../../shared/components/centered/Centered";

const ChatWaiting: React.FC = () => {
    const [messageSent, setMessageSent] = useState<boolean>(false)
    const sessionApiState: SessionApiState = useAppSelector(state => state.sessionApiState);
    const { isLoading, sendMessage, isJoined, isConnected } = useWebSocket();
    const router = useRouter();
    useEffect(() => {

        if (sessionApiState.sessionToken && !messageSent) {

                sendMessage({sessionId: sessionApiState.sessionToken, type: WebRTCMessageEnum.Init});
                setMessageSent(true)
            } else  {
            router.push('/')
        }
    }, [sessionApiState.sessionToken]);

    useEffect(() => {
        if (isJoined) {
            setTimeout(() => {
                router.push('/chat')

            },1500)
        }
    }, [isJoined]);
    return (
        <section>
            <Centered>
            <div>
                <Indicator />
                <Status isLoading={isLoading} isConnected={isConnected} isJoined={isJoined} />
            </div>
            </Centered>
        </section>
    )
}
export default ChatWaiting;