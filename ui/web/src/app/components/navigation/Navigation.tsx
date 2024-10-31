import React from "react";
import styles from './Navigation.module.scss';
import Link from "next/link";

const Navigation: React.FC = () => {
    console.log("process.env.TURN_1", process.env.TURN_1)
    return (
        <nav className={styles.navigation}>
            <ul className={styles.navigation__list}>

                <li className={styles.navigation__menuItem}><Link href="/">Home</Link></li>
                <li className={styles.navigation__menuItem}>About</li>
                <li className={styles.navigation__menuItem}>Privacy policy</li>
            </ul>
        </nav>
    )
}
export default Navigation;