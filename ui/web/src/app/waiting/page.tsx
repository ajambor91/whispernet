import React, {useEffect, useState} from 'react';
import {useAppSelector} from "../../../../shared/store/store";
import useWebSocket from "../../../../shared/hooks/useWebSocket";
import {IPeerState} from "../../../../shared/slices/createSession.slice";
import Hash from "../../../../shared/components/hash/Hash";


const ChatWaiting: React.FC = () => {
    const [status, setStatus] = useState<string>("Connecting")
    const peerState: IPeerState = useAppSelector(state =>  state?.peerState);
     const onStatus = useWebSocket(peerState);
    useEffect(() => {
        if(onStatus) {
            onStatus(data => setStatus(data))
        }
    }, [onStatus]);

    return (
        <section className="full-screen">
            <Hash peerState={peerState} sessionStatus={status}/>
            <h1>STATUS {status}</h1>
        </section>
    )
}
export default ChatWaiting;