'use client';
import {Peer} from "../singleton/peer";
import {IPeerState} from "../slices/createSession.slice";

const useWebSocket = (peerState: IPeerState) => {
    // let peerRef = useRef<Peer | null>(null)
    const peer: Peer = new Peer(peerState);

    // useEffect(() => {
    //     if (peerState && peerState.session && peerState.peerRole) {
    //         console.log("INNNNNNNNNNNNNNNNNNNNNNNN")
    //         peerRef.current =
    //         onStatus = peerRef.current.onStatus;
    //     }
    // }, []);

    return peer.onStatus;
};

export default useWebSocket;
