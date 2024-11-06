"use client"

import useNewChat from "../../../shared/hooks/useNewChat";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import Centered from "../../../shared/components/centered/Centered";
import Header from "../../../shared/components/header/Header";
import ChatActions from "../../../shared/components/chat-actions/ChatActions";
import {setCreateSession} from "../../dist/shared/slices/createSession.slice";
import {setCreatePeerState} from "../../../shared/slices/createSession.slice";

export default function Home() {
    const {createNewChat, response, error, loading} = useNewChat();
    const router = useRouter();
    const dispatch = useDispatch();
    const goToWaitingPage = () => {
        router.push('/waiting');
    }

    const goToJoiningPage = () => {
        router.push('/join');
    }

    useEffect(() => {
        dispatch(setCreatePeerState({
            session: response ? response.session : null,
            peerRole: response ? response.peerRole : null
        }));

        if (response && !error) {
            goToWaitingPage();
        }


        return () => {
        }
    }, [response, error, loading]);

    const handleNewChatClick = async () => {
        dispatch(setCreateSession({
            sessionToken: null,
            error: null,
            loading: true
        } as SessionApiState));
        await createNewChat();
    };

    const handleJoinChatClick = async () => {
        goToJoiningPage();
    };

    return (
        <div>
            <Centered>
                <Header/>
                <ChatActions onChatJoin={handleJoinChatClick} onChatCreate={handleNewChatClick} loading={loading}/>
            </Centered>
        </div>
    );
}
