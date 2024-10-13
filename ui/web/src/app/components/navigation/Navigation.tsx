import React from "react";
import styles from  './Navigation.module.scss';
const Navigation: React.FC = () => {
    return (
        <nav className={styles.navigation}>
            <ul className={styles.navigation__list}>
                <li className={styles.navigation__menuItem}>Home</li>
                <li  className={styles.navigation__menuItem}>About</li>
                <li  className={styles.navigation__menuItem}>Privacy policy</li>
            </ul>
        </nav>
    )
}
export default Navigation;