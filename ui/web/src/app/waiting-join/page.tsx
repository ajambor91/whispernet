'use client'
import React, {useEffect} from 'react';
import {useAppSelector} from "../../../../shared/store/store";
import useWebSocket from "../../../../shared/hooks/useWebSocket";
import  {SessionApiState} from "../../../../shared/slices/createSession.slice";

const ChatWaiting: React.FC = () => {
    const sessionApiState: SessionApiState = useAppSelector(state => state.sessionApiState);
    const { isLoading, sendToken } = useWebSocket();
    useEffect(() => {
            if (sessionApiState.sessionToken) {
                sendToken(sessionApiState.sessionToken);
            }
        return () => {
        }
    }, [sessionApiState]);
    return (
        <section>
            <div>
                {isLoading ? "Czekaj" :"Go"}
            </div>
        </section>
    )
}
export default ChatWaiting;