import React from "react";

import styles from './ChatActions.module.scss';
import Button from "../elements/button/Button";

interface IChatActionsProps {
    onChatCreate?: () => void;
    onChatJoin?: () => void;
    loading: boolean;
}

const ChatActions: React.FC<IChatActionsProps> = ({onChatCreate, onChatJoin, loading}) => {
    return (
        <div className={styles.buttonsContainer}>
            <Button className="button-primary" onClick={onChatCreate} disabled={loading}>
                {loading ? 'Creating...' : 'New chat'}
            </Button>
            <Button className="button-primary" onClick={onChatJoin} disabled={loading}>
                {loading ? 'Creating...' : 'Join'}
            </Button>
        </div>
    );
};

export default ChatActions;