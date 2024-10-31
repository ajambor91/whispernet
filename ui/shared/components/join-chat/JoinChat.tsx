import styles from './JoinChat.module.scss';
import React, {useState} from "react";
import Button from "../elements/button/Button";
import Input from "../elements/input/input";
import InlineDiv from "../elements/inline-div/InlineDiv";
import SecondaryHeader from "../elements/secondary-header/SecondaryHeader";
import TertiaryHeader from "../elements/tertiary-header/TertiaryHeader";
import {faCopy} from "@fortawesome/free-solid-svg-icons/faCopy";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface ChatJoiningProps {
    onChatSubmit?: (hash: string) => void;
}

const JoinChat: React.FC<ChatJoiningProps> = ({onChatSubmit}) => {
    const [hash, setHash] = useState('');
    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        if (!!e && !!onChatSubmit) {
            e.preventDefault();
            onChatSubmit(hash);
        }
    }

    const handleChange = (e: any) => {
        const sessionHash: string = e.target.value;
        setHash(sessionHash);
    }

    return (
        <div className={styles.joinChatContainer}>
            <SecondaryHeader>Connect to Client Using Hash</SecondaryHeader>
            <form onSubmit={handleSubmit}>
                <div>
                    <TertiaryHeader>Paste hash from peer: </TertiaryHeader>
                    <InlineDiv><Input id="sessionHash" name="sessionHash" value={hash}
                                      onChange={onChatSubmit ? handleChange : () => {
                                      }} type="text"/> </InlineDiv>
                    <InlineDiv>
                        <Button className={"primary"} type={"submit"}>
                            Submit <FontAwesomeIcon style={{fontSize: '1.5rem'}} icon={faCopy}/>
                        </Button>
                    </InlineDiv>
                </div>
            </form>
        </div>
    )

}

export default JoinChat;