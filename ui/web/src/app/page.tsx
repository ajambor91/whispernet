"use client"

import ChatActions from "@shared/components/chat-actions/ChatActions";
import Centered from "@shared/components/centered/Centered"
import Header from "@shared/components/header/Header"
import useNewChat from "../../../shared/hooks/useNewChat";
import useJoinChat from "../../../shared/hooks/useJoinChat";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useAppDispatch} from '@shared/store/store';
import {setWSession} from '@shared/slices/wsession';
import {useDispatch} from "react-redux";
export default function Home() {
    const { createNewChat, response, loading, error } = useNewChat();
    const [showNewChat, setShowNewChat] = useState<boolean>(false);
    const [data, setData] = useState(null);
    const router = useRouter();
    const {state} = router;
    const dispatch = useDispatch();
    const goToWaitingPage = () => {
        console.log('xxxxxYYYY')
        router.push('/waiting');
    }

    const goToJoiningPage = () => {
        router.push('/join');
    }
    const handleNewChatClick = async () => {
        const data = await createNewChat(); // Wysyłamy request do API
        console.log('DDDDDD', data)
        if (data) {
            dispatch(setWSession(data));
            setShowNewChat(true); // Jeśli brak błędu, pokazujemy komponent NewChat
            goToWaitingPage()

        }
    };

    const handleJoinChatClick = async () => {
        goToJoiningPage();
    }
  return (
      <div>
          <Centered>
        <Header />
        <ChatActions onChatJoin={handleJoinChatClick.bind(this)} onChatCreate={handleNewChatClick.bind(this)} />
          </Centered>
      </div>
  );
}
