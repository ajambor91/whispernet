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

interface IHashProps {
    peerState: IPeerState;
    sessionStatus: string
}

const Hash: React.FC<IHashProps> = ({peerState, sessionStatus}) => {
    const handleCopy = () => {
        if (!!peerState.session) {
            navigator.clipboard.writeText(peerState.session.sessionToken).then(() => {

            });
        }
    };
    return (
        <div className={`${styles.hash} full-screen`}>
            <Centered>
                <SecondaryHeader className={styles.hash__header}>Waiting for peer...</SecondaryHeader>
                <TertiaryHeader className={styles.hash__header}>Copy below hash:</TertiaryHeader>
                <div className={styles.hash__inputWrapper}>
                    <Input type="text" value={peerState.session?.sessionToken ?? ''} disabled={true}/>
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