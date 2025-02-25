import React from "react";
import Indicator from "../indicator/Indicator";
import {IPeerState} from "../../slices/createSession.slice";
import Status from "../status/Status";
import styles from "./Hash.module.scss"
import Centered from "../elements/centered/Centered";
import Input from "../elements/input/Input";
import Button from "../elements/button/Button";
import SecondaryHeader from "../elements/secondary-header/SecondaryHeader";
import TertiaryHeader from "../elements/tertiary-header/TertiaryHeader";
import {faCopy} from "@fortawesome/free-solid-svg-icons/faCopy";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {EClientStatus} from "../../enums/client-status.enum";

interface IHashProps {
    peerState: IPeerState;
    sessionStatus: EClientStatus
}

const Hash: React.FC<IHashProps> = ({peerState, sessionStatus}) => {
    const handleCopy = () => {
        if (!!peerState.sessionToken) {
            navigator.clipboard.writeText(peerState.sessionToken).then(() => {

            });
        }
    };
    return (
        <div className={`${styles.hash} full-screen`}>
            <Centered>
                <SecondaryHeader className={styles.hash__header}>Waiting for peer...</SecondaryHeader>
                <TertiaryHeader className={styles.hash__header}>Copy below hash:</TertiaryHeader>
                <div className={styles.hash__inputWrapper}>
                    <Input onClick={handleCopy} className={styles.hash__input} type="text"
                           value={peerState.sessionToken ?? ''} disabled={true}/>
                    <Button className={styles.hash__inputWrapper__copyButton} onClick={handleCopy}><FontAwesomeIcon
                        style={{fontSize: '1.5rem'}} icon={faCopy}/></Button>
                </div>
                <Indicator/>
                <Status sessionStatus={sessionStatus}/>
            </Centered>

        </div>
    )
}
export default Hash;