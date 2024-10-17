'use client'
import React, {useEffect} from 'react';
import {useAppSelector} from "../../../../shared/store/store";
import useWebSocket from "../../../../shared/hooks/useWebSocket";
import {SessionApiState} from "../../../../shared/slices/createSession.slice";
import {WebRTCMessageEnum} from "../../../../shared/enums/webrtc-message-enum";

const ChatWaiting: React.FC = () => {
    const sessionApiState: SessionApiState = useAppSelector(state => state.sessionApiState);
    const { isLoading, sendMessage } = useWebSocket();
    useEffect(() => {
            if (sessionApiState.sessionToken) {
                sendMessage({sessionId: sessionApiState.sessionToken, type: WebRTCMessageEnum.Init});
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