import {WebrtcPeerMessage} from "../../models/webrtc-peer-message.model";
import styles from './Message.module.scss';
interface MessageProps {
    message: WebrtcPeerMessage;
}

const Message: React.FC<MessageProps> = ({message}) => {
    return (
        <div  className={`${styles.messageContainer} ${
            message.type === 'incoming'
                ? styles.messageContainerIncoming
                : styles.messageContainerReply
        }`}>


            <div
                className={`${styles.messageContainer__messageContent} ${
                    message.type === 'incoming'
                        ? styles.messageContainer__messageContentIncoming
                        : styles.messageContainer__messageContentReply
                }`}
                dangerouslySetInnerHTML={{ __html: message.content }}
            />
        </div>
    )
}

export default Message;