'use client'
import React, {useEffect, useState} from 'react';
import {useAppSelector} from "../../../../shared/store/store";
import useWebSocket from "../../../../shared/hooks/useWebSocket";
import {IPeerState} from "../../../../shared/slices/createSession.slice";
import Status from "../../../../shared/components/status/Status";
import Indicator from "../../../../shared/components/indicator/Indicator";
import Centered from "../../../../shared/components/centered/Centered";


const ChatWaiting: React.FC = () => {
    const [status, setStatus] = useState<string>("Connecting")
    const peerState: IPeerState = useAppSelector(state => state.peerState);
    const onStatus = useWebSocket(peerState);
    useEffect(() => {
        if (onStatus) {
            onStatus(data => setStatus(data))
        }
    }, []);

    return (
        <section>
            <Centered>
                <div>
                    <Indicator/>
                    <Status sessionStatus={status}/>
                </div>
            </Centered>
        </section>
    )
}
export default ChatWaiting;