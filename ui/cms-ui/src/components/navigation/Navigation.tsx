import React from "react";
import Link from "next/link";
import styles from './Navigation.module.scss';
const Navigation: React.FC = () => {
    return (
        <div className={styles['navigation-container']}>
            <h1 className={styles['navigation-container__header']}>WHISPERNET</h1>
            <nav className={styles['navigation-container__nav']}>
                <ul className={styles['nav-menu']}>
                    <li className={styles['nav-menu__item']}><Link href='/'>Home</Link></li>
                    <li className={styles['nav-menu__item']}><Link href='/features'>Features</Link></li>
                    <li className={styles['nav-menu__item']}><Link href='/mission'>Our mission</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default Navigation;