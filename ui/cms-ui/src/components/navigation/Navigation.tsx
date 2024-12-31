import React from "react";
import Link from "next/link";
import styles from './Navigation.module.scss';
import {useTranslation} from 'next-i18next';
import {ELang} from "@/enums/lang.enum";
import {setLangCookie} from "@/core/cookie";
import {useState, useRef} from 'react';

const Navigation: React.FC = () => {
    const { t, i18n  } = useTranslation("translation");
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menu = useRef<HTMLElement | null>(null);
    const setCurrentLang = (lang: ELang) => {
        i18n.changeLanguage(lang as string);
        setLangCookie(lang);
    }
    const showLangMenu = () => {
        setIsMenuOpen((prevState) => !prevState);
        menu.current?.classList.toggle(styles['lang-menu--active']);
        menu.current?.classList.toggle(styles['lang-menu--disabled']);
    }
    return (
        <div className={styles['navigation-container']}>
            <h1 className={styles['navigation-container__header']}>WHISPERNET</h1>
            <nav className={styles['navigation-container__nav']}>
                <ul className={styles['nav-menu']}>
                    <li className={styles['nav-menu__item']}><Link href='/'>{t("home")}</Link></li>
                    <li className={styles['nav-menu__item']}><Link href='/features'>{t("features")}</Link></li>
                    <li className={styles['nav-menu__item']}><Link href='/mission'>{t("our-mission")}</Link></li>
                    <li className={styles['nav-menu__item']}><Link href='https://github.com/ajambor91/whispernet'>Github</Link></li>

                    <li onClick={showLangMenu} className={`${styles['nav-menu__item']} ${styles['nav-menu__lang']}`}>{t('language')}
                        <div ref={menu} className={`${styles['lang-menu']} ${styles['lang-menu--disabled']}`}>
                            <ul className={styles['lang-menu__list']}>
                                <li onClick={() => setCurrentLang(ELang.EN)} className={styles['lang-menu__item']}>EN
                                </li>
                                <li onClick={() => setCurrentLang(ELang.PL)} className={styles['lang-menu__item']}>PL
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Navigation;