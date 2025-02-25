import styles from './Message.module.scss';
import {IWebrtcLocalMessage} from "../../models/webrtc-preparing-message.moidel";

interface IMessageProps {
    message: IWebrtcLocalMessage;
}

const Message: React.FC<IMessageProps> = ({message}) => {
    return (
        <div className={`${styles.messageContainer} ${
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
                dangerouslySetInnerHTML={{__html: message.content}}
            />
        </div>
    )
}

export default Message;