import React from "react";
import styles from './CenteredHorizontally.module.scss'
const CenteredHorizontally: React.FC = ({children}) => {
    return (
        <div className={styles.centeredContainer}>
            <div className={styles.centeredContainer__content}>
                {children}
            </div>
        </div>
    )
}
export default CenteredHorizontally;