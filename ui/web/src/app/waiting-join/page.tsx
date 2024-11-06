'use client'
import React, {useEffect, useState} from 'react';
import {useAppSelector} from "../../../../shared/store/store";
import useWebSocket from "../../../../shared/hooks/useWebSocket";
import {IPeerState, SessionApiState} from "../../../../shared/slices/createSession.slice";
import {useRouter} from "next/navigation";
import Status from "../../../../shared/components/status/Status";
import Indicator from "../../../../shared/components/indicator/Indicator";
import Centered from "../../../../shared/components/centered/Centered";
import {IAuthMessage} from "../../../../shared/models/ws-message.model";
import {EWebSocketEventType} from "../../../../shared/enums/ws-message.enum";
import {EClientStatus} from "../../../../shared/enums/client-status.model";
import {AppEvent} from "../../../../shared/singleton/app-event.singleton";

const ChatWaiting: React.FC = () => {
    const peerState: IPeerState = useAppSelector(state => state.peerState);

     useWebSocket(peerState);
    const router = useRouter();

    // useEffect(() => {
    //
    //     if (sessionApiState.sessionToken && !messageSent) {
    //         const wsMessage: IAuthMessage = {
    //                 type: EWebSocketEventType.Auth,
    //                 session: {
    //                     sessionToken: sessionApiState.sessionToken
    //                 }
    //         }
    //         sendMessage(wsMessage);
    //         setMessageSent(true)
    //     } else {
    //         router.push('/')
    //     }
    // }, [sessionApiState.sessionToken]);
    //
    // useEffect(() => {
    //     if (isJoined) {
    //         setTimeout(() => {
    //             router.push('/chat')
    //
    //         }, 1500)
    //     }
    // }, [isJoined]);
    return (
        <section>
            <Centered>
                <div>
                    <Indicator/>
                    <Status isLoading={false} isConnected={false} isJoined={false}/>
                </div>
            </Centered>
        </section>
    )
}
export default ChatWaiting;