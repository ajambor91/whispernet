import styles from './Header.module.scss';
import React from "react";
import PrimaryHeader from "../elements/primary-header/PrimaryHeader";
import SecondaryHeader from "../elements/secondary-header/SecondaryHeader";
import Image from "next/image";
import logo from "../../pics/whispernet_logo_256.png"

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <img src={logo} alt="WhisperNet Logo"  className={styles["logo"]} />
            <PrimaryHeader>WhisperNet</PrimaryHeader>
            <SecondaryHeader>A Fully Anonymous Chat Over WebRTC</SecondaryHeader>
        </header>
    )
}
export default Header;