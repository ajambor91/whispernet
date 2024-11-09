import {useRef} from "react";
import styles from './MessageInput.module.scss'
import {IWebrtcPeerMessage} from "../../models/webrtc-peer-message.model";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUp} from "@fortawesome/free-solid-svg-icons/faCircleUp";

interface IMessageInput {
    sendMessage: (msg: IWebrtcPeerMessage) => void;
    setMessageInput: (height: number) => void;
}

const MessageInput: React.FC<IMessageInput> = ({sendMessage, setMessageInput}) => {
    const messageRef = useRef<HTMLDivElement>(null);

    const handleInput = () => {

        const input = messageRef.current as HTMLDivElement;
        input.style.height = 'auto';
        input.style.overflowY = 'hidden';
        input.style.height = `${input.scrollHeight}px`;
        const heightMatch = input.style.height.match(/[0-9]*/);
        const height: number = +heightMatch[0];
        setMessageInput(height)
        if (heightMatch && 150 < +heightMatch[0]) {
            input.style.overflowY = 'auto';


        }

    };
    const passMessage = () => {
        const messageElement: HTMLDivElement = messageRef.current as HTMLDivElement;
        const msg: IWebrtcPeerMessage = {
            type: undefined,
            sessionId: '',
            content: messageElement.innerHTML
        }
        sendMessage(msg)
        messageElement.focus();
        messageElement.innerHTML = '';
        const input = messageRef.current as HTMLDivElement;
        input.style.height = 'auto';
    }
    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                insertLineBreak();
            } else {
                e.preventDefault();
                passMessage();
            }
        }
    };

    const insertLineBreak = () => {
        const selection: Selection = window.getSelection() as Selection;
        if (!!selection && !selection.rangeCount) return;

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
                    <FontAwesomeIcon icon={faCircleUp} style={{fontSize: '1.5rem'}}/></button>
            </div>
        </div>

    )
}
export default MessageInput;