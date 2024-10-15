"use client"

import React from "react";

import styles from './ChatActions.module.scss';
interface ChatActionsProps {
    onChatCreate?: () => void;
    onChatJoin?: () => void;
    loading: boolean;
}
const ChatActions: React.FC<ChatActionsProps> = ({onChatCreate, onChatJoin, loading}) => {
    return (
        <div className={styles.buttonsContainer}>
            <button className={styles.buttonsContainer__button}  onClick={onChatCreate} disabled={loading}>
                {loading ? 'Creating...' : 'New Chat'}
            </button>
            <button className={styles.buttonsContainer__button} onClick={onChatJoin} disabled={loading}>
                {loading ? 'Creating...' : 'Join'}
            </button>
        </div>
    );
};

export default ChatActions;