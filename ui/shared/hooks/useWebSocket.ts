import { IPeerState } from "../slices/createSession.slice";
import { useEffect, useRef, useCallback } from "react";
import {IPeer} from "../models/peer.model";
import {initializePeer} from "../webrtc/peer";

const useWebSocket = (peerState: IPeerState) => {
    const peerRef = useRef<IPeer | null>(null);

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
            peerRef.current = initializePeer(peerState);
        }

    }, [peerState]);

    return setOnStatus;
};

export default useWebSocket;
