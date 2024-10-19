import styles from './JoinChat.module.scss';
import {useState} from "react";
import Button from "../button/Button";

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
            <h2>Connect to Client Using Hash</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <p>Paste hash from peer: </p>
                    <input id="sessionHash" name="sessionHash" value={hash} onChange={onChatSubmit ? handleChange : () =>{}} type="text"></input>
                </div>
                <div><Button className={"primary"} type={"submit"}>
                    <span>ssss</span>
                </Button>
                </div>
            </form>
        </div>
    )

}

export default JoinChat;