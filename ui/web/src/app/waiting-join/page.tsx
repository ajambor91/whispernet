'use client'
import React from 'react';
import {useAppSelector} from "../../../../shared/store/store";
import useWebSocket from "../../../../shared/hooks/useWebSocket";
const ChatWaiting: React.FC = () => {
    const wSession = useAppSelector(state => state.wSession);
    console.log(wSession)
    const { isConnected, messages, sendToken } = useWebSocket();
    console.log('wSession.wSession.sessionToken',wSession.wSession.sessionToken)
    sendToken(wSession.wSession.sessionToken);
    return (
        <section>
            <div>
                Czekaj
            </div>
        </section>
    )
}
export default ChatWaiting;