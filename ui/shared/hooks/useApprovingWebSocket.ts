import {IPeerState} from "../slices/createSession.slice";
import {useEffect, useRef} from "react";
import {ApprovingWs} from "../websocket-appr/approving";

const useApprovingWebSocket = (peerState?: IPeerState) => {
    const peerRef = useRef<ApprovingWs | null>(null);
    const sendAuthMessage: () => void = () => {

        if (peerRef.current) {
            peerRef.current.sendAuthMessage();
        }
    };


    useEffect(() => {
        if (peerState && !peerRef || !peerRef.current) {
            peerRef.current = new ApprovingWs(peerState);
        }
    }, [peerState]);

    return {sendAuthMessage};
};

export default useApprovingWebSocket;
