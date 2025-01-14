import React, {useState} from "react";

import styles from './ChatActions.module.scss';
import Button from "../elements/button/Button";
import Checkbox, {ICheckboxOption} from "../elements/checkbox/Checkbox";
import {b} from "vite/dist/node/types.d-aGj9QkWt";

interface IChatActionsProps {
    onChatCreate?: (isForce: boolean) => void;
    onChatJoin?: () => void;
    loading: boolean;
    setIsForceSigned: (isForce: boolean) => void;
}

const ChatActions: React.FC<IChatActionsProps> = ({onChatCreate, setIsForceSigned, onChatJoin, loading}) => {
    const [isForce, setIsForce] = useState<boolean>();
    const checkboxChange = (event: string[]) => {
        if (event.length > 0) {
            event.forEach(item => {
                setIsForce(item === "force");
                setIsForceSigned(item === "force");
            });
        } else {
            setIsForce(false);
            setIsForceSigned(false)
        }


    }

    const checkboxOptions: ICheckboxOption[] = [
        {
            label: "Force signed session",
            value: "force",
            id: "force",
            name: "force"
        }
    ]

    const startChat = () => {
        onChatCreate(isForce);
    }
    return (
        <div className={styles["buttons-container"]}>
            <div className={styles["buttons-container__item"]}>
                <Button style={{"width": "100%"}} className="button-primary" onClick={startChat} disabled={loading}>
                    {loading ? 'Creating...' : 'New chat'}
                </Button>
                <Checkbox options={checkboxOptions} valueChange={checkboxChange} />
            </div>
            <div className={styles["buttons-container__item"]}>
                <Button style={{"width": "100%"}} className="button-primary" onClick={onChatJoin} disabled={loading}>
                    {loading ? 'Creating...' : 'Join'}
                </Button>
            </div>
        </div>
    );
};

export default ChatActions;