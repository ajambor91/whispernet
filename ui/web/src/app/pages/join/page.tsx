import React, {useEffect} from "react";
import useJoinChat from "../../../../../shared/hooks/useJoinChat";
import JoinChat from "../../../../../shared/components/join-chat/JoinChat";
import {useDispatch} from "react-redux";
import {IPeerState, setCreatePeerState,} from "../../../../../shared/slices/createSession.slice";
import Centered from "../../../../../shared/components/elements/centered/Centered";
import {useNavigate} from "react-router-dom";
import {logError, logInfo} from "../../../../../shared/error-logger/web";
import {useToasts} from "../../../../../shared/providers/toast-provider";
import {EPGPAuthStatus} from "../../../../../shared/enums/pgp-auth-status.enum";
import {PgpAuthEnumMapper} from "../../../../../shared/enums/pgp-auth-enum.mapper";
import {addPartners} from "../../../../../shared/slices/partners-keys.slice";

const ChatJoining: React.FC = () => {
    const router = useNavigate();
    const {joinChat, response, error} = useJoinChat();
    const dispatch = useDispatch();
    const {addToast} = useToasts();

    const navigateToApproving = () => {
        logInfo({message: "Navigating to approving page"});
        router('/approving');
    }
    const navigateToWaiting = () => {
        logInfo({message: "Navigating to waiting join page"});
        router('/waiting-join');
    }

    const navigateToLogin = () => {
        logInfo({message: "Navigating to waiting join page"});
        router("/initialize-login");
    }

    useEffect(() => {
        logInfo({message: "ChatJoining component mounted"});
        if (response) {
            logInfo({message: "Received response from joinChat", response});
            dispatch(setCreatePeerState(response));
        }

        if (response && response.sessionAuthType === EPGPAuthStatus.WAITING_FOR_PEER_ACCEPTED) {
            dispatch(addPartners(response.partners))
            navigateToApproving();
            return;
        }

        if (response) {
            navigateToWaiting();
            return;
        }
        if (error && error.status === 401) {
            addToast({
                title: "Error",
                type: "info",
                description: "You're not verified, your partner requests you to verify your identity."
            });
            dispatch(setCreatePeerState({
                sessionToken: error.sessionToken,
                sessionAuthType: PgpAuthEnumMapper.mapValue(error.sessionAuthType),
                peerRole: error.peerRole,
                secretKey: error.secretKey
            }))
            navigateToLogin();
        } else if (error) {
            addToast({
                title: "Error",
                type: "error",
                description: error.message
            });
        }
        return () => {
            logInfo({message: "ChatJoining component unmounted"});
        }
    }, [response, error]);

    const onChatSubmit = async (hash: string) => {
        logInfo({message: "Submitting chat join request", hash});
        dispatch(setCreatePeerState({
            session: null,
            peerRole: null
        } as IPeerState));

        try {
            await joinChat(hash);
            logInfo({message: "joinChat called successfully"});
        } catch (error) {
            logError({message: "Error in joinChat", error});
        }
    }

    return (
        <section className="full-screen">
            <Centered>
                <JoinChat onChatSubmit={onChatSubmit}></JoinChat>
            </Centered>
        </section>
    )
}

export default ChatJoining;
