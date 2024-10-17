'use client'
import React, {useEffect} from 'react';
import {useAppSelector} from "../../../../shared/store/store";
import useWebSocket from "../../../../shared/hooks/useWebSocket";
import  {SessionApiState} from "../../../../shared/slices/createSession.slice";
import {WebRTCMessageEnum} from "../../../../shared/enums/webrtc-message-enum";
const ChatWaiting: React.FC = () => {
    const sessionApiState: SessionApiState = useAppSelector(state => state.sessionApiState);
    const {  sendMessage, isConnected } = useWebSocket();
    useEffect(() => {
        console.log('isConnected',isConnected)
            console.log("(sessionApiState.sessionToken",sessionApiState.sessionToken)
            if (sessionApiState.sessionToken && isConnected) {
                sendMessage({sessionId: sessionApiState.sessionToken, type: WebRTCMessageEnum.Init})
            }

        return () => {
        }
    }, [sessionApiState, isConnected]);
    return (
        <section>
            <div>
                <h2>Copy and paste </h2>
                <p>hash: {sessionApiState.sessionToken}</p></div>
        </section>
    )
}
export default ChatWaiting;