import { Peer } from "../singleton/peer";
import { IPeerState } from "../slices/createSession.slice";
import { useEffect, useRef, useCallback } from "react";

const useWebSocket = (peerState: IPeerState) => {
    const peerRef = useRef<Peer | null>(null);

    const setOnStatus = useCallback(
        (callback: (data: string) => void) => {
            if (peerRef.current) {
                peerRef.current.onStatus(callback);
            }
        },
        []
    );

    useEffect(() => {
        if (!peerRef.current && peerState?.session && peerState?.peerRole) {
            peerRef.current = new Peer(peerState);
        }

    }, [peerState]);

    return setOnStatus;
};

export default useWebSocket;
