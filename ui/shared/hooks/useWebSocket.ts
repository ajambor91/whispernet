'use client';
import {Peer} from "../singleton/peer";
import {IPeerState} from "../slices/createSession.slice";
import {useEffect, useState} from "react";

const useWebSocket = (peerState: IPeerState) => {
    const [onStatus, setOnStatus] = useState<(fn: (data: string) => void) => void>();
    useEffect(() => {
        if (peerState && peerState.session && peerState.peerRole) {
            const peer = new Peer(peerState)
            setOnStatus(() => peer.onStatus)
        }
    }, []);

    return onStatus;
};

export default useWebSocket;
