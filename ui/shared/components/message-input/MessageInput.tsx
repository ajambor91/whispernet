import {useRef} from "react";

interface MessageInput {
    addMessage?: (msg: string) => string;
}
const MessageInput: React.FC<MessageInput> = ({addMessage}) => {
    const messageRef = useRef<HTMLDivElement>(null);

    const passMessage = () => {
        if (messageRef.current) {
            const msg: string = messageRef.current.innerHTML;
            addMessage(msg)
        }
    }
    return (
        <div>
            <div ref={messageRef} contentEditable={true}></div>
            <button onClick={passMessage}></button>
        </div>
    )
}
export default MessageInput;