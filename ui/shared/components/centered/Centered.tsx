import React from "react";
import styles from './Centered.module.scss';
interface CenteredProps {
    children: React.ReactNode;
}
const Centered: React.FC<CenteredProps> = ({children}) => {
    return (
        <div className={styles.centeredContainer}>
            <div className={styles.centeredContainer__content}>
                {children}
            </div>
        </div>
    )
}
export default Centered;