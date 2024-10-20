import {useRef} from "react";
import styles from './MessageInput.module.scss'
import {WebrtcPeerMessage} from "../../models/webrtc-peer-message.model";
import Button from "../elements/button/Button";
import message from "../message/Message";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUp} from "@fortawesome/free-solid-svg-icons/faCircleUp";
interface MessageInput {
    sendMessage?: (msg: WebrtcPeerMessage) => void;
}
const MessageInput: React.FC<MessageInput> = ({sendMessage}) => {
    const messageRef = useRef<HTMLDivElement>(null);

    const handleInput = (e) => {
        const input = messageRef.current;
        input.style.height = 'auto'; // Resetuj wysokość
        input.style.overflowY = 'hidden';
        input.style.height = `${input.scrollHeight}px`; // Ustaw wysokość na podstawie treści
        console.log(input.style.height.match(/[0-9]*/) )
        console.log(input.style.height)
        if (150 < +input.style.height.match(/[0-9]*/)[0] ) {
            input.style.overflowY = 'auto'
        }
    };
    const passMessage = () => {
        if (messageRef.current) {
            const msg: WebrtcPeerMessage = {
                type: undefined,
                sessionId: 'fdsfdsfd',
                content: messageRef.current.innerHTML
            }
            sendMessage(msg)
            messageRef.current.focus();
            messageRef.current.innerHTML = '';
        }
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (e.ctrlKey) {
                insertLineBreak();
            } else {
                e.preventDefault();
                passMessage();
            }
        }
    };

    const insertLineBreak = () => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const br = document.createElement('br');
        range.deleteContents();
        range.insertNode(br);

        const space = document.createTextNode('\u00a0');
        range.insertNode(space);
        range.setStartAfter(space);
        range.setEndAfter(space);
        selection.removeAllRanges();
        selection.addRange(range);
    };
    return (
        <div className={styles['input-container']}>
            <div
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                className={styles['input-container__input']}
                ref={messageRef}
                contentEditable={true}
            ></div>
            <div className={styles['input-container__button-container']}>
                <button
                    className={styles['input-container__button-container__button']}
                    onClick={passMessage}
                >
                     <FontAwesomeIcon icon={faCircleUp} style={{ fontSize: '1.5rem' }}/>               </button>
            </div>
        </div>

    )
}
export default MessageInput;