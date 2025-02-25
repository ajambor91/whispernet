import {useRef} from "react";
import styles from './MessageInput.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUp} from "@fortawesome/free-solid-svg-icons/faCircleUp";
import ScrollContainer from "../elements/scroll-container/ScrollContainer";
import {IWebrtcLocalMessage} from "../../models/webrtc-preparing-message.moidel";

interface IMessageInput {
    sendMessage: (msg: IWebrtcLocalMessage) => void;
    setMessageInput: (height: number) => void;
}

const MessageInput: React.FC<IMessageInput> = ({sendMessage, setMessageInput}) => {
    const messageRef = useRef<HTMLDivElement>(null);
    const inputContainerRef = useRef<HTMLDivElement | null>(null);
    const handleInput = () => {
        const inputContainer = inputContainerRef.current as HTMLDivElement;
        const input = messageRef.current as HTMLDivElement;
        const inputScrollHeight: number = input.scrollHeight + 66;
        inputContainer.style.height = `${inputScrollHeight}px`;
        const heightMatch = input.style.height.match(/[0-9]*/);

    };

    const passMessage = () => {
        const messageElement: HTMLDivElement = messageRef.current as HTMLDivElement;
        const msg: IWebrtcLocalMessage = {
            type: undefined,
            content: messageElement.innerHTML,
        };
        sendMessage(msg);
        messageElement.focus();
        messageElement.innerHTML = '';
        const input = messageRef.current as HTMLDivElement;
        const heightMatch = input.style.height.match(/[0-9]*/);
        const height: number = +heightMatch[0];
        setMessageInput(height);
        handleInput();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
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
        if (!selection || !selection.rangeCount) return;

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
        <div id="message-input-container" ref={inputContainerRef} className={styles['message-input']}>
            <ScrollContainer wheelOnId="message-input-text-area">
                <div
                    id="message-input-text-area"
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    className={styles['message-input__text-area']}
                    ref={messageRef}
                    contentEditable={true}
                ></div>
            </ScrollContainer>
            <div id="message-input-button-container" className={styles['message-input__button-container']}>
                <button
                    id="message-input-send-button"
                    className={styles['message-input__send-button']}
                    onClick={passMessage}
                >
                    <FontAwesomeIcon icon={faCircleUp} style={{fontSize: '1.5rem'}}/>
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
