import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import useNewChat from "../../../../../shared/hooks/useNewChat";
import Centered from "../../../../../shared/components/elements/centered/Centered";
import Header from "../../../../../shared/components/header/Header";
import ChatActions from "../../../../../shared/components/chat-actions/ChatActions";
import {IPeerState, setCreatePeerState} from "../../../../../shared/slices/createSession.slice";
import {logError, logInfo, logWarning} from "../../../../../shared/error-logger/web";
import {IISLoginState} from "../../../../../shared/slices/is-login.slize";
import {useAppSelector} from "../../../../../shared/store/store";
import styles from "./Home.module.scss";
import useNewSignedChat from "../../../../../shared/hooks/useNewSignedChat";
import {useToasts} from "../../../../../shared/providers/toast-provider";
import {EPGPAuthStatus} from "../../../../../shared/enums/pgp-auth-status.enum";

export default function Home() {
    const [isForceSigned, setIsForceSigned] = useState<boolean>(false);
    const {createNewChat, response, newChatError, loading} = useNewChat();
    const {createNewSignedChat, signedResponse} = useNewSignedChat();
    const router = useNavigate();
    const dispatch = useDispatch();
    const {addToast} = useToasts();

    const loginData: IISLoginState = useAppSelector(state => state.isLoginState);
    const goToWaitingPage = () => {
        logInfo({message: "Navigating to waiting page"});
        router('/waiting');
    };

    const goToApproving = () => {
        logInfo({message: "Navigating to approving page"})
        router("/approving");
    }

    const goToJoiningPage = () => {
        logInfo({message: "Navigating to joining page"});
        router('/join');
    };

    const handleForce = (isForce: boolean) => {
        setIsForceSigned(isForce);
        if (!loginData.isLogin) {
            logInfo({message: "Navigating to login page"});
            addToast({
                title: "Info",
                autoClose: true,
                description: "You have to sign in to create signed session",
                type: "info"
            });
            router("/initialize-login");
        }
    }

    useEffect(() => {
        logInfo({message: "Home component mounted"});
        const peerState: IPeerState = response ?? signedResponse;
        if (!peerState) {
            logWarning({message: "Session data response is empty"});
            return;
        }
        dispatch(setCreatePeerState(peerState));

        logInfo({message: "Received response from createNewChat", response});
        if (peerState && peerState.sessionAuthType === EPGPAuthStatus.CHECK_RESPONDER) {
            goToApproving();
            return;
        }
        if (peerState) {
            goToWaitingPage();
            return;
        }


        if (newChatError) {
            addToast({
                autoClose: false,
                title: "Error",
                type: 'error',
                description: "Cannot create new chat. Please try again later."
            })
            logError({message: "Error in createNewChat"});
        }

        return () => {
            logInfo({message: "Home component unmounted"});
        };
    }, [response, signedResponse, newChatError, loading]);

    const goToLogin = () => router("/initialize-login");
    const goToRegister = () => router("/register");
    const handleNewChatClick = async () => {
        logInfo({message: "New chat button clicked"});


        try {
            if (!isForceSigned) {
                await createNewChat();

            } else {
                await createNewSignedChat();
            }

            dispatch(setCreatePeerState({
                sessionToken: null,
                error: null,
                loading: true,
                isSigned: isForceSigned
            } as IPeerState));
            logInfo({message: "createNewChat called successfully"});
        } catch (err) {
            logError({message: "Error calling createNewChat", error: err});
        }
    };

    const handleJoinChatClick = () => {
        logInfo({message: "Join chat button clicked"});
        goToJoiningPage();
    };

    return (
        <div>
            <div className={styles["authorization-container"]}>
                {loginData.isLogin ? <div className={styles["authorization-info"]}>
                        <p className={styles["authorization-info__text"]}>Signed as: {loginData.username}</p>
                    </div>
                    :
                    <div className={styles["authorization-links"]}>
                        <a href="#" className={styles["authorization-links__link-item"]}
                           onClick={goToRegister}>Register</a>
                        <a href="#" className={styles["authorization-links__link-item"]} onClick={goToLogin}>Login</a>
                    </div>
                }
            </div>
            <Centered>
                <Header/>
                <ChatActions
                    setIsForceSigned={handleForce}
                    onChatJoin={handleJoinChatClick}
                    onChatCreate={handleNewChatClick}
                    loading={loading}
                />
            </Centered>
        </div>
    );
}
