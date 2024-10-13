import React from "react";
interface WaitingChatProps {
    wSessionHash: string;
}
const WaitingChat: React.FC<WaitingChatProps> = ({wSessionHash}) => {
    return (
        <div>
            <input value={wSessionHash} type="text"/>
        </div>
    )
}