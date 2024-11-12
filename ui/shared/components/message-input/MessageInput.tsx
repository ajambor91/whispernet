import {useRef, useState} from "react";
import styles from './MessageInput.module.scss';
import { IWebrtcPeerMessage } from "../../models/webrtc-peer-message.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUp } from "@fortawesome/free-solid-svg-icons/faCircleUp";
import ScrollContainer from "../elements/scroll-container/ScrollContainer";

interface IMessageInput {
    sendMessage: (msg: IWebrtcPeerMessage) => void;
    setMessageInput: (height: number) => void;
}

const MessageInput: React.FC<IMessageInput> = ({ sendMessage, setMessageInput }) => {
    const messageRef = useRef<HTMLDivElement>(null);
    const inputContainerRef = useRef<HTMLDivElement | null>(null);
    const [trigger, setTrigger] = useState<number>(0)
    const handleInput = () => {
        const inputContainer = inputContainerRef.current as HTMLDivElement;
        const input = messageRef.current as HTMLDivElement;
        const inputScrollHeight: number = input.scrollHeight + 66;
        inputContainer.style.height = `${inputScrollHeight}px`;
        const heightMatch = input.style.height.match(/[0-9]*/);
        setTrigger(trigger + 1)

    };

    const passMessage = () => {
        setTrigger(0)
        const messageElement: HTMLDivElement = messageRef.current as HTMLDivElement;
        const msg: IWebrtcPeerMessage = {
            type: undefined,
            sessionId: '',
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
        setTrigger(0)
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
            <ScrollContainer wheelOnId="message-input-text-area" trigger={trigger}>
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
                    <FontAwesomeIcon icon={faCircleUp} style={{ fontSize: '1.5rem' }} />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
