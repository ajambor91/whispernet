import React from "react";
import styles from "./FullHeight.module.scss"

interface IFullHeight {
    children: React.ReactNode;
}

const FullHeight: React.FC<IFullHeight> = ({children}) => {
    return (<div className={styles.fullHeightContainer}>
        {children}
    </div>)
}

export default FullHeight