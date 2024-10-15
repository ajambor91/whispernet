'use client'
import React, {useEffect} from 'react';
import {useAppSelector} from "../../../../shared/store/store";
import useWebSocket from "../../../../shared/hooks/useWebSocket";
import  {SessionApiState} from "../../../../shared/slices/createSession.slice";
const ChatWaiting: React.FC = () => {
    const sessionApiState: SessionApiState = useAppSelector(state => state.sessionApiState);
    const {  sendToken, isConnected } = useWebSocket();
    useEffect(() => {
        console.log('isConnected',isConnected)
            console.log("(sessionApiState.sessionToken",sessionApiState.sessionToken)
            if (sessionApiState.sessionToken && isConnected) {
                sendToken(sessionApiState.sessionToken)
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