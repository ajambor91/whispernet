/// <reference types="react" />
interface ChatJoiningProps {
    onChatSubmit?: (hash: string) => void;
}

declare const JoinChat: React.FC<ChatJoiningProps>;
export default JoinChat;
