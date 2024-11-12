import React, {useEffect, useState} from "react";
import {useToasts} from "../../providers/toast-provider";
import styles from './Toast.module.scss'
import {IToast} from "../../models/toast.model";
const Toast: React.FC= () => {
    const { toasts, removeToast } = useToasts();
    const [existingToasts, setExistingToasts] = useState<IToast<object>[]>([])
    console.log("toasts, ", toasts)
    const calcTranslate = () => toasts.length > 0 ? toasts.length * 120 : 120
    useEffect(() => {
        setExistingToasts(toasts)
    }, [toasts]);
    return (
        <div className={styles.toastsContainer}              style={{
            transform: `translateY(${calcTranslate()}px)`,
            top: `-${calcTranslate() - 10}px`,
            transition: 'transform .250s ease-in'
        }}>
            {toasts.map(toast => (
                <div key={toast.id} className={styles.toastsContainer__toastWrapper}>


                    <p>{toast.id}</p>
                    <p></p>
                </div>

            ))}
        </div>

    )
}
export default Toast