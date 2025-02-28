import {IPeerState} from "../slices/createSession.slice";
import {useCallback, useEffect, useRef} from "react";
import {ApprovingWs} from "../websocket-appr/approving";
import {IApprovingMessageWs} from "../models/approving-message-ws.model";

const useApprovingWebSocket = (peerState?: IPeerState) => {
    const peerRef = useRef<ApprovingWs | null>(null);
    const sendAuthMessage = useCallback(() => {
      if (peerRef.current) {
          peerRef.current.sendAuthMessage();
      }
    },[])
    const onMessage = useCallback(
        (callback: (data: IApprovingMessageWs) => void) => {
            if (peerRef.current) {
                peerRef.current.on('msg',callback);
            }
        },
        []
    );

    const closeSocket = useCallback(() => {
        if (peerRef.current) {
            peerRef.current.closeSocket();
        }
    },[])

    const acceptPartner = useCallback((username: string) => {
        if (peerRef.current) {
            peerRef.current.acceptPartner(username);
        }
    },[])

    const declinePartner = useCallback((username: string) => {
        if (peerRef.current) {
            peerRef.current.declinePartner(username);
        }
    },[])

    useEffect(() => {
        if (peerState && !peerRef || !peerRef.current) {
            peerRef.current = new ApprovingWs(peerState);
        }
    }, [peerState]);

    return {sendAuthMessage, onMessage, acceptPartner, declinePartner, closeSocket};
};

export default useApprovingWebSocket;
