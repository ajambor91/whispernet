import styles from './Header.module.scss';
import React from "react";
import PrimaryHeader from "../elements/primary-header/PrimaryHeader";
import SecondaryHeader from "../elements/secondary-header/SecondaryHeader";
import logo from "../../pics/whispernet_logo_256.png"

const Header: React.FC = () => {
    return (
        <header className={styles['header']}>
            <img src={logo} alt="WhisperNet Logo" className={styles["header__logo"]}/>
            <PrimaryHeader>WhisperNet</PrimaryHeader>
            <SecondaryHeader>A Fully Anonymous Chat Over WebRTC</SecondaryHeader>
            <p className={styles['header__monit']}>NOTE: Your company or internet provider might be blocking P2P connections. In this case, you won't be able to connect with your friend.</p>
        </header>
    )
}
export default Header;