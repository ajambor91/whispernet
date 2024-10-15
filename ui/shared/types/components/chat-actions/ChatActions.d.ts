import React from "react";
interface ChatActionsProps {
    onChatCreate?: () => void;
    onChatJoin?: () => void;
}
declare const ChatActions: React.FC<ChatActionsProps>;
export default ChatActions;
