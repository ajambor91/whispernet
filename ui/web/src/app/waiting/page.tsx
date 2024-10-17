'use client'
import React, {useEffect, useState} from 'react';
import {useAppSelector} from "../../../../shared/store/store";
import useWebSocket from "../../../../shared/hooks/useWebSocket";
import  {SessionApiState} from "../../../../shared/slices/createSession.slice";
import {WebRTCMessageEnum} from "../../../../shared/enums/webrtc-message-enum";
const ChatWaiting: React.FC = () => {
    console.log('//////////////////////////////////////////////////////////////////////')
    const [messageSent, setMessageSent] = useState<boolean>(false)

    const sessionApiState: SessionApiState = useAppSelector(state => state.sessionApiState);
    const {  sendMessage, isConnected } = useWebSocket();

    useEffect(() => {
        console.log('##########################################', sessionApiState, messageSent)

        if (sessionApiState.sessionToken && !messageSent) {
            console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')

            sendMessage({sessionId: sessionApiState.sessionToken, type: WebRTCMessageEnum.Init})
            setMessageSent(true)

        }
    }, [sessionApiState.sessionToken]);
    return (
        <section>
            <div>
                <h2>Copy and paste </h2>
                <p>hash: {sessionApiState.sessionToken}</p></div>
        </section>
    )
}
export default ChatWaiting;