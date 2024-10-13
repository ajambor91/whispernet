import styles from './Header.module.scss';
import React from "react";


const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <h1 className={styles.header__h1}>WHISPER NET</h1>
            <h2 className={styles.header__h2}>A Fully Anonymous Chat Over WebRTC</h2>
        </header>
    )
}
export default Header;