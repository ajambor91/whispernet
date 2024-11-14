import styles from './JoinChat.module.scss';
import React, { useState } from 'react';
import Button from '../elements/button/Button';
import Input from '../elements/input/Input';
import SecondaryHeader from '../elements/secondary-header/SecondaryHeader';
import TertiaryHeader from '../elements/tertiary-header/TertiaryHeader';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IChatJoiningProps {
    onChatSubmit?: (hash: string) => void;
}

const JoinChat: React.FC<IChatJoiningProps> = ({ onChatSubmit }) => {
    const [hash, setHash] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onChatSubmit) {
            onChatSubmit(hash);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHash(e.target.value);
    };

    return (
        <div className={styles['join-chat']}>
            <SecondaryHeader>Connect to Client Using Hash</SecondaryHeader>
            <form className={styles['join-chat__form']} onSubmit={handleSubmit}>
                <div>
                    <TertiaryHeader>Paste hash from peer:</TertiaryHeader>
                    <div className={styles['join-chat__hash-wrapper']}>
                        <Input
                            className={styles['join-chat__form-input']}
                            id="sessionHash"
                            name="sessionHash"
                            value={hash}
                            onChange={onChatSubmit ? handleChange : undefined}
                            type="text"
                        />
                        <Button className={`primary ${styles['join-chat__form-button']}`} type="submit">
                            Submit <FontAwesomeIcon style={{ fontSize: '1.5rem' }} icon={faCopy} />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default JoinChat;
