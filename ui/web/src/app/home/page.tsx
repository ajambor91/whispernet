import useNewChat from "../../../../shared/hooks/useNewChat";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import Centered from "../../../../shared/components/centered/Centered";
import Header from "../../../../shared/components/header/Header";
import ChatActions from "../../../../shared/components/chat-actions/ChatActions";
import {setCreateSession} from "../../../dist/shared/slices/createSession.slice";
import {IPeerState, setCreatePeerState} from "../../../../shared/slices/createSession.slice";
import {useNavigate} from "react-router-dom";

export default function Home() {
    const {createNewChat, response, error, loading} = useNewChat();
    const router = useNavigate();
    const dispatch = useDispatch();
    const goToWaitingPage = () => {
        router('/waiting');
    }

    const goToJoiningPage = () => {
        router('/join');
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
        } as IPeerState));
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
