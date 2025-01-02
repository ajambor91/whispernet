import '../../styles/globals.scss'
import styles from './Chat.module.scss'
import React, {Ref, useEffect, useRef, useState} from "react";
import Message from "../message/Message";
import MessageInput from "../message-input/MessageInput";
import {IWebrtcPeerMessage} from "../../models/webrtc-peer-message.model";
import {IPeerState} from "../../slices/createSession.slice";
import {onMessage, sendWebRTCMessage} from "../../webrtc/peer";
import FullHeight from "../elements/full-height/FullHeight";
import ScrollContainer from "../elements/scroll-container/ScrollContainer";
import {useToasts} from "../../providers/toast-provider";
import {MessageEncoder} from "../../webrtc/wasm";
import {IWebrtcLocalMessage} from "../../models/webrtc-preparing-message.moidel";
import {IWasmEncoded} from "../../models/wasm-encoded.model";


interface IChatComponentProps {
    peerState: IPeerState
}

const ChatComponent: React.FC<IChatComponentProps> = ({peerState}) => {
    if (!peerState) {
        throw new Error("Null peerState provided");
    }
    const encoder: React.Ref<MessageEncoder> = useRef(new MessageEncoder(peerState.secretKey as string));
    const [messages, setMessages] = useState<IWebrtcLocalMessage[]>([]);
    const [messageInputHeight, setMessageInputHeight] = useState<number>(0)
    const [trigger, setTrigger] = useState<number>(0)
    const addMessage = (content: IWebrtcLocalMessage) => {
        setTrigger(0)
        if (content.sessionId !== peerState.sessionToken) {
            throw new Error('Invalid session token!')
        }
        setMessages(prevState => [
            ...prevState,
            {
                ...content,
                messageId: prevState.length + 1
            }
        ])
    }

    const stringfyWebRTCPeerMsg = (msg: IWebrtcPeerMessage) => {
        return JSON.stringify(msg);
    }

    const parseWebRTCPeerMsg = (msg: string): IWebrtcPeerMessage => {
        return JSON.parse(msg);
    }
    const sendMessage = async (content: IWebrtcLocalMessage) => {
        if (!encoder.current) {
            throw new Error("Null encoded provided");
        }
        const msg: IWasmEncoded = (encoder.current as MessageEncoder).encodeMessage(content.content);
        sendWebRTCMessage(stringfyWebRTCPeerMsg({iv: msg.iv, encryptedMsg: msg.encryptedMsg, sessionId: peerState.sessionToken as string}))
        addMessage({
            content: msg.sanitazedMsg,
            type: 'reply',
            sessionId: peerState.sessionToken as string
        })
        setTrigger(trigger + 1);

    }

    useEffect(() => {

        onMessage((event) => {
                if (!encoder.current) {
                    throw new Error("Null encoded provided");
                }
                const incommingMessage: IWebrtcPeerMessage = parseWebRTCPeerMsg(event)
                const msg: IWebrtcLocalMessage = {
                    content: (encoder.current as MessageEncoder).decodeMessage(incommingMessage.encryptedMsg, incommingMessage.iv).decryptedMessage,
                    messageId: incommingMessage.messageId,
                    type: 'incoming',
                    sessionId: incommingMessage.sessionId
                }
                addMessage(msg)
        })
    }, []);
    return (
        <FullHeight>
        <div className="full-screen relative">
            <div className={styles.chatContainer}>
                <div className={styles.messageContainer}>
                    <ScrollContainer resize={messageInputHeight}>
                        {messages.map(msg => (
                               <div key={msg.messageId}>
                                   <Message message={msg}/>
                               </div>
                        ))}
                    </ScrollContainer>
                </div>
                <div className={styles.chatContainer__input}>
                    <MessageInput sendMessage={sendMessage} setMessageInput={setMessageInputHeight}/>
                </div>
            </div>

        </div>
        </FullHeight>
    )
}
export default ChatComponent;