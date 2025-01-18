import React from "react";
import styles from './Centered.module.scss';

interface ICenteredProps {
    children: React.ReactNode;
}

const Centered: React.FC<ICenteredProps> = ({children}) => {
    return (
        <div className={styles["centered-container"]}>
            <div className={styles["centered-container__content"]}>
                {children}
            </div>
        </div>
    )
}
export default Centered;