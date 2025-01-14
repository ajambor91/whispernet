import styles from './AppBar.module.scss';
import React from 'react';
import PrimaryHeader from '../elements/primary-header/PrimaryHeader';
import TertiaryHeader from '../elements/tertiary-header/TertiaryHeader';
import Button from "../elements/button/Button";
import {useNavigate} from "react-router-dom";

interface IAppBarProps {
    isLogin: boolean;
    username: string;
}

const AppBar: React.FC<IAppBarProps> = ({isLogin, username}) => {
    const router = useNavigate();
    const goToLogin = () => router("/initialize-login");
    const goToRegister = () => router("/register");
    return (
        <section className={styles['app-bar']}>
            <div className={styles['app-bar__container']}>
                <div className={styles['app-bar__version-wrapper']}>
                    <PrimaryHeader style={{fontSize: '20px', marginTop: '-5px'}}>
                        WhisperNet
                    </PrimaryHeader>
                    <TertiaryHeader style={{fontSize: '15px', textAlign: 'left'}}>
                        0.1.0 BETA
                    </TertiaryHeader>
                </div>
                <div className={styles["authorization-container"]}>
                    {isLogin ? <div className={styles["authorization-info"]}>
                            <p className={styles["authorization-info__text"]}>Signed as: {username}</p>
                        </div>
                        :
                        <div className={styles["authorization-links"]}>
                            <a href="#" className={styles["authorization-links__link-item"]}
                               onClick={goToRegister}>Register</a>
                            <a href="#" className={styles["authorization-links__link-item"]}
                               onClick={goToLogin}>Login</a>
                        </div>
                    }
                </div>

            </div>
        </section>
    );
};

export default AppBar;
