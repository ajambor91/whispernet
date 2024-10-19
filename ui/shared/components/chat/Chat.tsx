'use client'
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
        setMessages(prevState =>  [
            ...prevState,
            content
        ])
    }
    const sendMessage = (content: WebrtcPeerMessage) => {
        sendWebRTCMessage(JSON.stringify(content))
        addMessage(content)
    }
    useEffect(() => {
        if (connectionState && connectionState.dataChannel) {
            getWebRTCDataChannel().onmessage = (event) => {
                const incommingMessage: WebrtcPeerMessage = JSON.parse(event.data)
                addMessage(incommingMessage)
            }
        }
    }, [connectionState]);
    return (
        <div>
            {messages.map(msg => (
                <Message message={msg.content}/>
            ))}
            <MessageInput sendMessage={sendMessage} />
        </div>
    )
}
export default ChatComponent;