import styles from "./Approving.module.scss";
import {useAppSelector} from "../../../../../shared/store/store";
import {IPeerState, setCreatePeerState} from "../../../../../shared/slices/createSession.slice";
import useApprovingWebSocket from "../../../../../shared/hooks/useApprovingWebSocket";
import React, {useEffect, useState} from "react";
import TertiaryHeader from "../../../../../shared/components/elements/tertiary-header/TertiaryHeader";
import Hash from "../../../../../shared/components/hash/Hash";
import {PeerRole} from "../../../../../shared/enums/peer-role.enum";
import {addPartners, IPartner, nullPartners} from "../../../../../shared/slices/partners-keys.slice";
import useInitiatorUpdateChat from "../../../../../shared/hooks/useInitiatorUpdateChat";
import {useDispatch} from "react-redux";
import {EWsApprovingMsgType} from "../../../../../shared/enums/ws-approving-msg-type.enum";
import PartnerApprove from "../../../../../shared/components/partner-approve/PartnerApprove";
import {useNavigate} from "react-router-dom";
import {useToasts} from "../../../../../shared/providers/toast-provider";
import Centered from "../../../../../shared/components/elements/centered/Centered";

const Approving: React.FC = () => {
    const {addToast} = useToasts();
    const dispatch = useDispatch();
    const peerState: IPeerState = useAppSelector(state => state.peerState);
    const partners: IPartner[] = useAppSelector(state => state.partnersState.partners)
    const router = useNavigate();
    const [status, setStatus] = useState<string>("Waiting for partner verification");
    const {initiatorUpdateChat, response} = useInitiatorUpdateChat();
    const {sendAuthMessage, onMessage, acceptPartner, declinePartner, closeSocket} = useApprovingWebSocket(peerState);
    useEffect(() => {
        if (sendAuthMessage) {
            sendAuthMessage()
        }
    }, [sendAuthMessage]);

    useEffect(() => {

        onMessage((data) => {
            switch (data.type) {
                case EWsApprovingMsgType.TOUCH:
                    if (!partners || partners.length === 0) {
                        initiatorUpdateChat(peerState);
                    }
                    break;
                case EWsApprovingMsgType.ACCEPT:
                    addToast({
                        title: "Accepted",
                        type: "info",
                        description: "Partner accepted session"
                    })
                    break;
                case EWsApprovingMsgType.SESSION_ACCEPTED:
                    addToast({
                        title: "Accepted",
                        type: "info",
                        description: "Session accepted"
                    })
                    closeSocket();
                    router(peerState.peerRole === PeerRole.Initiator ?
                        "/waiting" :
                    "/waiting-join")
                    break;
                case EWsApprovingMsgType.DECLINE:
                case EWsApprovingMsgType.SESSION_DECLINED:
                    addToast({
                        title: "Declined",
                        type: "error",
                        description: "Partner declined session"
                    })
                    dispatch(setCreatePeerState(null));
                    dispatch(nullPartners());
                    closeSocket();
                    router("/");
                    break;
            }
        })
    }, [onMessage]);

    useEffect(() => {
        if (response && response.partners) {
            dispatch(addPartners(response.partners));
            dispatch(setCreatePeerState(response));
        }
    }, [response]);

    useEffect(() => {
        if (!peerState) {
            router('/');
        }
    }, [peerState]);
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
                <Centered>
                    {partners && partners.length > 0 ?
                    <div>
                        {partners.map(peer =>

                            <PartnerApprove
                                accept={acceptPartner}
                                decline={declinePartner}
                                partnerKey={peer.publicKey}
                                partnerName={peer.username}/>
                        )}
                    </div>
                    :
                    <TertiaryHeader>Redirecting</TertiaryHeader>}
                </Centered>
            }

        </section>
    )
}

export default Approving;