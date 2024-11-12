import '../../styles/globals.scss'
import styles from './Chat.module.scss'
import React, {useEffect, useRef, useState} from "react";
import Message from "../message/Message";
import MessageInput from "../message-input/MessageInput";
import {IWebrtcPeerMessage} from "../../models/webrtc-peer-message.model";
import {IPeerState} from "../../slices/createSession.slice";
import {onMessage, sendWebRTCMessage} from "../../webrtc/peer";
import FullHeight from "../elements/full-height/FullHeight";
import ScrollContainer from "../elements/scroll-container/ScrollContainer";
import {useToasts} from "../../providers/toast-provider";


interface IChatComponentProps {
    peerState: IPeerState
}

const ChatComponent: React.FC<IChatComponentProps> = ({peerState}) => {
    const [messages, setMessages] = useState<IWebrtcPeerMessage[]>([]);
    const [messageInputHeight, setMessageInputHeight] = useState<number>(0)
    const [trigger, setTrigger] = useState<number>(0)
    const addMessage = (content: IWebrtcPeerMessage) => {
        setTrigger(0)
        if (content.sessionId !== peerState.session.sessionToken) {
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
    const sendMessage = (content: IWebrtcPeerMessage) => {
        sendWebRTCMessage(stringfyWebRTCPeerMsg({...content, sessionId: peerState.session.sessionToken as string}))
        addMessage({
            ...content,
            type: 'reply',
            sessionId: peerState.session.sessionToken as string
        })
        setTrigger(trigger + 1);

    }

    useEffect(() => {

        onMessage((event) => {
                const incommingMessage: IWebrtcPeerMessage = parseWebRTCPeerMsg(event)
                addMessage({
                    ...incommingMessage,
                    type: 'incoming'
                })
        })
    }, []);
    return (
        <FullHeight>
        <div className="full-screen relative">
            <div className={styles.chatContainer}>
                <div className={styles.messageContainer}>
                    <ScrollContainer resize={messageInputHeight} trigger={trigger}>
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