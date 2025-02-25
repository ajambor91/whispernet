import React, {useEffect, useState} from "react";
import {useToasts} from "../../providers/toast-provider";
import styles from './Toast.module.scss';
import {IToast} from "../../models/toast.model";

const Toast: React.FC = () => {
    const {toasts, removeToast} = useToasts();
    const [existingToasts, setExistingToasts] = useState<IToast<object>[]>([]);
    const [closingToasts, setClosingToasts] = useState<Record<string, boolean>>({});

    const handleRemoveToast = (id) => {
        setClosingToasts((prev) => ({...prev, [id]: true}));
    };
    useEffect(() => {
        setExistingToasts(toasts);
    }, [toasts]);

    return (
        <div className={styles["toasts-container"]}>
            {existingToasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{
                        top: `${index * 80}px`,
                        transition: 'top 0.3s ease-in-out',
                    }}
                    className={`${styles["toasts-container__toast-wrapper"]} ${
                        closingToasts[toast.id] ? styles.fadeOut : styles.fadeIn
                    } ${
                        toast.type === 'success' ? styles["toast-success"]
                            : toast.type === 'error' ? styles["toast-error"]
                                : toast.type === 'info' ? styles["toast-info"]
                                    : ''
                    }`}
                    onAnimationEnd={() => {
                        if (toast.autoClose) removeToast(toast.id);
                    }}
                >
                    <div className={styles["toast-body"]}>
                        <div className={styles["toast-body__close"]}>
                            <button onClick={() => removeToast(toast.id)} className={styles['close']}>&times;</button>
                        </div>
                        <div className={styles["toast-body__header"]}>
                            <h4>{toast.title}</h4>
                        </div>
                        <div className={styles["toast-body__description"]}>
                            <p>{toast.description}</p>
                        </div>
                    </div>

                </div>
            ))}
        </div>
    );
};

export default Toast;
