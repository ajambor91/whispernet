'use client'
import React, {useState} from "react";
import Message from "../message/Message";
import MessageInput from "../message-input/MessageInput";
import {getWebRTCDataChannel, sendWebRTCMessage} from "../../singleton/webrtc.singleton";
type MessageType = 'incoming' | 'reply'
interface UserMessage {
    id: number;
    content: string;
    type: MessageType
}
const ChatComponent: React.FC = () => {
    const [messages, setMessages] = useState<UserMessage[]>([]);
/*    getWebRTCDataChannel().onmessage = (event) => {
        console.log('ON MESSAGE', event.data)
    }*/

    const addMessage = (content: string) => {
        setMessages(prevState =>  [
            ...prevState,
            {id: prevState.length + 1, type: 'incoming', content}
        ])
    }
    const sendMessage = (content: string) => {
        sendWebRTCMessage("XXXXX")
    }
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