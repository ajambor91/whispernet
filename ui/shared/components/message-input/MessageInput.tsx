import {useRef} from "react";
import styles from './MessageInput.module.scss'
import {WebrtcPeerMessage} from "../../models/webrtc-peer-message.model";
interface MessageInput {
    sendMessage?: (msg: WebrtcPeerMessage) => void;
}
const MessageInput: React.FC<MessageInput> = ({sendMessage}) => {
    const messageRef = useRef<HTMLDivElement>(null);

    const passMessage = () => {
        if (messageRef.current) {
            const msg: WebrtcPeerMessage = {
                type: 'incoming',
                sessionId: 'fdsfdsfd',
                content: messageRef.current.innerHTML
            }
            sendMessage(msg)
        }
    }
    return (
        <div className={styles.inputContainer}>
            <div ref={messageRef} contentEditable={true}></div>
            <button onClick={passMessage}>Send message</button>
        </div>
    )
}
export default MessageInput;