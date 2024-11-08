'use client'
import '../../styles/globals.scss'
import styles from './Chat.module.scss'
import React, {useEffect, useState} from "react";
import Message from "../message/Message";
import MessageInput from "../message-input/MessageInput";
// import {getConnectionsState, getWebRTCDataChannel, sendWebRTCMessage} from "../../webrtc/webrtc.webrtc";
import {WebrtcPeerMessage} from "../../models/webrtc-peer-message.model";
import {IPeerState} from "../../slices/createSession.slice";
import {onMessage, sendWebRTCMessage} from "../../webrtc/peer";

type MessageType = 'incoming' | 'reply'

interface ChatComponentProps {
    peerState: IPeerState
}

const ChatComponent: React.FC<ChatComponentProps> = ({peerState}) => {
    const [messages, setMessages] = useState<WebrtcPeerMessage[]>([]);
    // const connectionState = getConnectionsState();
    const addMessage = (content: WebrtcPeerMessage) => {
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

    const stringfyWebRTCPeerMsg = (msg: WebrtcPeerMessage) => {
        return JSON.stringify(msg);
    }

    const parseWebRTCPeerMsg = (msg: string): WebrtcPeerMessage => {
        return JSON.parse(msg);
    }
    const sendMessage = (content: WebrtcPeerMessage) => {
        sendWebRTCMessage(stringfyWebRTCPeerMsg({...content, sessionId: peerState.session.sessionToken as string}))
        addMessage({
            ...content,
            type: 'reply',
            sessionId: peerState.session.sessionToken as string
        })
    }
    useEffect(() => {
            onMessage((event) => {
                const incommingMessage: WebrtcPeerMessage = parseWebRTCPeerMsg(event)
                console.log(incommingMessage)
                addMessage({
                    ...incommingMessage,
                    type: 'incoming'
                })
        })
    }, []);
    return (
        <div className="full-screen relative">
            <div className={styles.chatContainer}>
                <div className={styles.messageContaner}>
                    {messages.map(msg => (
                        <div key={msg.messageId} className={styles.messageContaner__wrapper}>
                            <Message message={msg}/>
                        </div>
                    ))}
                </div>
                <div>

                </div>

                <div className={styles.chatContainer__input}>
                    <MessageInput sendMessage={sendMessage}/>
                </div>
            </div>

        </div>
    )
}
export default ChatComponent;