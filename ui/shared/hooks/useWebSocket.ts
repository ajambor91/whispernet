import { IPeerState } from "../slices/createSession.slice";
import { useEffect, useRef, useCallback } from "react";
import {IPeer} from "../interfaces/peer.interface";
import {getPeer, initializePeer} from "../webrtc/peer";

const useWebSocket = (peerState?: IPeerState) => {
    const peerRef = useRef<IPeer | null>(null);

    const onStatus = useCallback(
        (callback: (data: string) => void) => {
            if (peerRef.current) {
                peerRef.current.onStatus(callback);
            }
        },
        []
    );

    const onSessionInfo = useCallback(
        (callback: (data: string) => void) => {
            if (peerRef.current) {
                peerRef.current.onSessionInfo(callback);
            }
        },
        []
    )

    useEffect(() => {
        if (!peerRef.current && peerState?.sessionToken && peerState?.peerRole) {
            peerRef.current = initializePeer(peerState);
        }

    }, [peerState]);

    useEffect(() => {
        if (!peerState && !peerRef.current) {
            peerRef.current = getPeer();
        }
    }, []);

    return {onStatus, onSessionInfo};
};

export default useWebSocket;
