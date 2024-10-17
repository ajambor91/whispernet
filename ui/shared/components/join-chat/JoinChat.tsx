import styles from './JoinChat.module.scss';
import {useState} from "react";

interface ChatJoiningProps {
    onChatSubmit?: (hash: string) => void;
}
const JoinChat: React.FC<ChatJoiningProps> = ({onChatSubmit}) => {
    const [hash, setHash] = useState('');
    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        if (!!e && !!onChatSubmit) {
            e.preventDefault();
            onChatSubmit(hash);
        }
        }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sessionHash: string = e.target.value;
        setHash(sessionHash);
    }
    return (
        <div className={styles.joinChatContainer}>
            <form onSubmit={handleSubmit}>
                <div>
                    <input id="sessionHash" name="sessionHash" value={hash} onChange={onChatSubmit ? handleChange : () =>{}} type="text"></input>
                </div>
                <div>
                <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )

}

export default JoinChat;