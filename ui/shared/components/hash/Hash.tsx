import React from "react";
import Indicator from "../indicator/Indicator";
import {SessionApiState} from "../../slices/createSession.slice";
import Status from "../status/Status";
import styles from "./Hash.module.scss"
import Centered from "../centered/Centered";
import Input from "../elements/input/input";
import Button from "../elements/button/Button";
import SecondaryHeader from "../elements/secondary-header/SecondaryHeader";
import TertiaryHeader from "../elements/tertiary-header/TertiaryHeader";
import {faCopy} from "@fortawesome/free-solid-svg-icons/faCopy";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface HashProps {
    sessionApiState: SessionApiState; // Typ dla sessionApiState, np. string
    isLoading: boolean;
    isConnected: boolean;
    isJoined: boolean;
}

const Hash: React.FC<HashProps> = ({sessionApiState, isLoading, isConnected, isJoined}) => {
    const handleCopy = () => {
        if (!!sessionApiState.sessionToken) {
            navigator.clipboard.writeText(sessionApiState.sessionToken).then(() => {

            });
        }
    };
    return (
        <div className={`${styles.hash} full-screen`}>
            <Centered>
                <SecondaryHeader className={styles.hash__header}>Waiting for peer...</SecondaryHeader>
                <TertiaryHeader className={styles.hash__header}>Copy below hash:</TertiaryHeader>
                <div className={styles.hash__inputWrapper}>
                    <Input type="text" value={sessionApiState.sessionToken ?? ''} disabled={true}/>
                    <Button className={styles.hash__inputWrapper__copyButton} onClick={handleCopy}><FontAwesomeIcon
                        style={{fontSize: '1.5rem'}} icon={faCopy}/></Button>
                </div>
                <Indicator/>
                <Status isLoading={isLoading} isConnected={isConnected} isJoined={isJoined}/>
            </Centered>

        </div>
    )
}
export default Hash;