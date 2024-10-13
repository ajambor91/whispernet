'use client'
import React from 'react';
import {useAppSelector} from "../../../../shared/store/store";
import useWebSocket from "../../../../shared/hooks/useWebSocket";
const ChatWaiting: React.FC = () => {
    const wSession = useAppSelector(state => state.wSession);
    console.log(wSession)
    const { isConnected, messages, sendToken } = useWebSocket();
    sendToken(wSession)
    return (
        <section>
            <div>
                <h2>Copy and paste </h2>
                <p>hash: {wSession.wSession.sessionToken}</p></div>
        </section>
    )
}
export default ChatWaiting;