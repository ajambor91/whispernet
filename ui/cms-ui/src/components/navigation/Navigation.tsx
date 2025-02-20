import React from "react";
import Link from "next/link";
import styles from './Navigation.module.scss';
import {useTranslation} from 'next-i18next';
import {ELang} from "@/enums/lang.enum";
import {setLangCookie} from "@/helpers/cookie";
import {useState, useRef} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {useDispatch} from "react-redux";
import {useAppDispatch} from "@/store/store";
import {setLang} from "@/store/slice";
import { useRouter } from 'next/router';
import Image from "next/image";

const Navigation: React.FC = () => {
    const { t, i18n  } = useTranslation("translation");
    const [langMenuOpen, setLangMenuOpen] = useState<boolean>(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const router = useRouter();
    const langMenu = useRef<HTMLDivElement | null>(null);
    const mobileMenu = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();

    const goTo = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        if (mobileMenuOpen) {
            mobileMenu.current?.classList.toggle(styles['navigation-container__nav__mobile--active']);
            mobileMenu.current?.classList.toggle(styles['navigation-container__nav__mobile--disabled']);
            setMobileMenuOpen(false);
        }

        if (langMenuOpen) {
            langMenu.current?.classList.toggle(styles['lang-menu--active']);
            langMenu.current?.classList.toggle(styles['lang-menu--disabled']);
            setLangMenuOpen(false);
        }
        router.push(path);
    }
    const setCurrentLang = (lang: ELang) => {
        i18n.changeLanguage(lang as string);
        setLangCookie(lang);
        dispatch(setLang({lang}))
    }
    const showLangMenu = () => {
        setLangMenuOpen((prevState) => !prevState);
        langMenu.current?.classList.toggle(styles['lang-menu--active']);
        langMenu.current?.classList.toggle(styles['lang-menu--disabled']);
    }

    const showMobileMenu = () => {
        setMobileMenuOpen(prevState => !prevState);
        mobileMenu.current?.classList.toggle(styles['navigation-container__nav__mobile--active']);
        mobileMenu.current?.classList.toggle(styles['navigation-container__nav__mobile--disabled']);
    }
    return (
        <div className={styles['navigation-container']}>
            <div className={styles["navigation-container__headers"]}>
                <Image src="/whispernet_logo_bar_92.png" alt="WhisperNet Logo" width="92" height="92" priority/>
                <div className={styles["navigation-container__header__container"]}>
                    <h1 className={styles['navigation-container__header']}><Link href="/"
                                                                                 onClick={(e) => goTo(e, "/")}>WhisperNet</Link>
                    </h1>
                    <h2 className={styles['navigation-container__version']}>0.1.1 BETA
                    </h2>
                </div>

            </div>


            <div className={styles["navigation-container__mobile-hamburger"]}>
                <button className={styles["hamburger-button"]} onClick={showMobileMenu}><FontAwesomeIcon size="2x"
                                                                                                         icon={faBars}/>
                </button>

            </div>
            <nav ref={mobileMenu}
                 className={`${styles['navigation-container__nav']} ${styles['navigation-container__nav__mobile--disabled']}`}>
                <ul className={styles['nav-menu']}>
                    <li className={styles['nav-menu__item']}><Link href="/features"
                                                                   onClick={(e) => goTo(e, "/features")}>{t("features")}</Link>
                    </li>
                    <li className={styles['nav-menu__item']}><Link href="/mission"
                                                                   onClick={(e) => goTo(e, "/mission")}>{t("our-mission")}</Link>
                    </li>
                    <li className={styles['nav-menu__item']}><Link
                        href='https://github.com/ajambor91/whispernet'>Github</Link></li>

                    <li onClick={showLangMenu}
                        className={`${styles['nav-menu__item']} ${styles['nav-menu__lang']}`}>{t('language')}
                        <div ref={langMenu} className={`${styles['lang-menu']} ${styles['lang-menu--disabled']}`}>
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