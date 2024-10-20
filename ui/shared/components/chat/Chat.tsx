'use client'
import '../../styles/globals.scss'
import styles from './Chat.module.scss'
import React, {useEffect, useState} from "react";
import Message from "../message/Message";
import MessageInput from "../message-input/MessageInput";
import {getConnectionsState, getWebRTCDataChannel, sendWebRTCMessage} from "../../singleton/webrtc.singleton";
import {WebrtcPeerMessage} from "../../models/webrtc-peer-message.model";
import {SessionApiState} from "../../slices/createSession.slice";
type MessageType = 'incoming' | 'reply'
interface ChatComponentProps {
    sessionApiState: SessionApiState
}
const ChatComponent: React.FC<ChatComponentProps> = ({sessionApiState}) => {
    const [messages, setMessages] = useState<WebrtcPeerMessage[]>([]);
    const connectionState = getConnectionsState();
    const addMessage = (content: WebrtcPeerMessage) => {
        if (content.sessionId !== sessionApiState.sessionToken) {
            throw new Error('Invalid session token!')
        }
        setMessages(prevState =>  [
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
        sendWebRTCMessage(stringfyWebRTCPeerMsg({...content, sessionId: sessionApiState.sessionToken as string}))
        addMessage({
            ...content,
            type: 'reply',
            sessionId: sessionApiState.sessionToken as string
        })
    }
    useEffect(() => {
        if (connectionState && connectionState.dataChannel) {
            ( getWebRTCDataChannel() as RTCDataChannel).onmessage = (event) => {
                const incommingMessage: WebrtcPeerMessage = parseWebRTCPeerMsg(event.data)
                console.log(incommingMessage)
                addMessage({
                    ...incommingMessage,
                    type: 'incoming'
                })
            }
        }
    }, [connectionState]);
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
                <MessageInput sendMessage={sendMessage} />
            </div>
            </div>

        </div>
    )
}
export default ChatComponent;