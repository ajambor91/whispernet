import styles from './Header.module.scss';
import React from "react";
import PrimaryHeader from "../elements/primary-header/PrimaryHeader";
import SecondaryHeader from "../elements/secondary-header/SecondaryHeader";


const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <PrimaryHeader>WHISPER NET</PrimaryHeader>
            <SecondaryHeader>A Fully Anonymous Chat Over WebRTC</SecondaryHeader>
        </header>
    )
}
export default Header;