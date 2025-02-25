import styles from "./Approving.module.scss";
import {useAppSelector} from "../../../../../shared/store/store";
import {IPeerState} from "../../../../../shared/slices/createSession.slice";
import useApprovingWebSocket from "../../../../../shared/hooks/useApprovingWebSocket";
import React, {useEffect, useState} from "react";
import TertiaryHeader from "../../../../../shared/components/elements/tertiary-header/TertiaryHeader";
import Hash from "../../../../../shared/components/hash/Hash";
import {PeerRole} from "../../../../../shared/enums/peer-role.enum";
import {IPartner} from "../../../../../shared/slices/partners-keys.slice";

const Approving: React.FC = () => {
    const peerState: IPeerState = useAppSelector(state => state.peerState);
    const partners: IPartner[] = useAppSelector(state => state.partnersState.partners)
    const [status, setStatus] = useState<string>("Connecting");

    const {sendAuthMessage} = useApprovingWebSocket(peerState);
    useEffect(() => {
        if (sendAuthMessage) {
            sendAuthMessage()
        }
    }, [sendAuthMessage]);
    return (
        <section className={styles["approving"]}>
            {peerState.peerRole === PeerRole.Initiator &&
            (!partners || partners.length === 0) ?
                <div>
                    <section className="full-screen">
                        <Hash peerState={peerState} sessionStatus={status}/>
                    </section>
                </div>
                :
                partners && partners.length > 0 ?
                    <div>
                        {partners.map(peer =>
                            <p>{peer.publicKey}</p>)}
                    </div>
                    :
                    <TertiaryHeader>Redirecting</TertiaryHeader>
            }

        </section>
    )
}

export default Approving;