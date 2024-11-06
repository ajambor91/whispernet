'use client'
import React, {useEffect, useState} from 'react';
import {useAppSelector} from "../../../../shared/store/store";
import useWebSocket from "../../../../shared/hooks/useWebSocket";
import {IPeerState} from "../../../../shared/slices/createSession.slice";
import {useRouter} from "next/navigation";
import Hash from "../../../../shared/components/hash/Hash";
import {EWebSocketEventType} from "../../../../shared/enums/ws-message.enum";
import {IAuthMessage} from "../../../../shared/models/ws-message.model";

const ChatWaiting: React.FC = () => {
    const [status, setStatus] = useState<boolean>(false)

    const peerState: IPeerState = useAppSelector(state => {
        console.log('IN SELECTOR', state)
        return state?.peerState
    });

    console.log('xxxx',peerState)
     const onStatus = useWebSocket(peerState);
    onStatus(data => {console.log("status => ",data)})
    // onStatus(setStatus)
    // const router = useRouter();
    // useEffect(() => {
    //     if (peerState.session.sessionToken) {
    //         const wsMessage: IAuthMessage = {
    //             type: EWebSocketEventType.Auth,
    //             session: {
    //                 sessionToken: sessionApiState.sessionToken
    //             }
    //         }
    //         console.log('XXXXXXXXXXXXXXXXX')
    //         setMessageSent(true)
    //
    //     } else {
    //         router.push('/')
    //     }
    // }, [sessionApiState.sessionToken]);


    return (
        <section className="full-screen">
            <Hash peerState={peerState} isLoading={false} isConnected={false}
                  isJoined={false}/>
            {/*<h1>STATUS {status}</h1>*/}
        </section>
    )
}
export default ChatWaiting;