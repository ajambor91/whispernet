import styles from './AppBar.module.scss';
import React from 'react';
import PrimaryHeader from '../elements/primary-header/PrimaryHeader';
import TertiaryHeader from '../elements/tertiary-header/TertiaryHeader';

const AppBar: React.FC = () => {
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
            </div>
        </section>
    );
};

export default AppBar;
