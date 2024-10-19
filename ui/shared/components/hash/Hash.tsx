import React, {useEffect, useState} from "react";
import Indicator from "../indicator/Indicator";
import {SessionApiState} from "../../slices/createSession.slice";
import Status from "../status/Status";
import styles from "./Hash.module.scss"
import Centered from "../centered/Centered";
interface HashProps {
    sessionApiState: SessionApiState; // Typ dla sessionApiState, np. string
    isLoading: boolean;
    isConnected: boolean;
    isJoined: boolean;
}
const Hash: React.FC<HashProps> = ({sessionApiState, isLoading, isConnected, isJoined}) => {
    const copyHash = () => {

    }
    return (
        <div className={`${styles.hash} full-screen`}>
            <Centered>
                <h2 className={styles.hash__header}>Waiting for peer...</h2>
                <p className={styles.hash__header}>Copy below hash:</p>
                <div className={styles.hash__inputWrapper}>
                    <input className={styles.hash__input} value={sessionApiState.sessionToken ?? ''} disabled={true}/>
                    <button className={styles.hash__inputWrapper__copyButton} onClick={copyHash}>Copy hash!</button>
                </div>
                <Indicator/>
                <Status isLoading={isLoading} isConnected={isConnected} isJoined={isJoined}/>
            </Centered>

        </div>
    )
}
export default Hash;