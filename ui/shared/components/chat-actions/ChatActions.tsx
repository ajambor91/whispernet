"use client"

import React, {useState, useEffect} from "react";
import useNewChat from '../../hooks/useNewChat';
import NewChat from '../new-chat/new-chat';
import styles from './ChatActions.module.scss';
interface ChatActionsProps {
    onChatCreate?: () => void;
    onChatJoin?: () => void;
}
const ChatActions: React.FC<ChatActionsProps> = ({onChatCreate, onChatJoin}) => {
    const { createNewChat, response, loading, error } = useNewChat();
    const [showNewChat, setShowNewChat] = useState<boolean>(false);
    const [data, setData] = useState(null);
    // const router = useRouter();
    // const {state} = router;

    const goToWaitingPage = () => {
        // router.push('/waiting');
    }
    const handleNewChatClick = async () => {
        await createNewChat(); // Wysyłamy request do API
        if (!error) {
            setShowNewChat(true); // Jeśli brak błędu, pokazujemy komponent NewChat
            goToWaitingPage()

        }
    };
    // useEffect(() => {
    //     if (state) {
    //         setData(state);
    //     }
    // }, [state]);


    return (
        <div className={styles.buttonsContainer}>
            <button className={styles.buttonsContainer__button}  onClick={onChatCreate} disabled={loading}>
                {loading ? 'Creating...' : 'New Chat'}
            </button>
            <button className={styles.buttonsContainer__button} onClick={onChatJoin}>Join</button>

            {error && <p>Error: {error}</p>}
            {showNewChat && response && <NewChat response={response} />}
        </div>
    );
};

export default ChatActions;