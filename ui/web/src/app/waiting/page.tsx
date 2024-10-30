'use client'
import React, {useEffect, useState} from 'react';
import {useAppSelector} from "../../../../shared/store/store";
import useWebSocket from "../../../../shared/hooks/useWebSocket";
import {SessionApiState} from "../../../../shared/slices/createSession.slice";
import {useRouter} from "next/navigation";
import Hash from "../../../../shared/components/hash/Hash";
import {WSMessage} from "../../../../shared/models/ws-message.model";
import {ClientStatus} from "../../../../shared/enums/client-status.model";
import {WsMessageEnum} from "../../../../shared/enums/ws-message.enum";
import {PeerRole} from "../../../../shared/enums/peer-role.enum";

const ChatWaiting: React.FC = () => {
    const [messageSent, setMessageSent] = useState<boolean>(false)

    const sessionApiState: SessionApiState = useAppSelector(state => state.sessionApiState);
    const {  sendMessage, isConnected, isJoined, isLoading } = useWebSocket();
    const router = useRouter();
    useEffect(() => {
        if (sessionApiState.sessionToken && !messageSent) {
            const wsMessage: WSMessage = {
                msgType: 'peer',
                session: {
                    sessionToken: sessionApiState.sessionToken
                },
                remotePeerStatus: ClientStatus.Unknown,
                type: WsMessageEnum.Connect,
                peerStatus: ClientStatus.Start,
            }
            console.log('XXXXXXXXXXXXXXXXX')
            sendMessage(wsMessage)
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