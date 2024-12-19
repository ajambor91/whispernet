import React, { useEffect, useState } from "react";
import { useToasts } from "../../providers/toast-provider";
import styles from './Toast.module.scss';
import { IToast } from "../../models/toast.model";

const Toast: React.FC = () => {
    const { toasts, removeToast } = useToasts();
    const [existingToasts, setExistingToasts] = useState<IToast<object>[]>([]);
    const [closingToasts, setClosingToasts] = useState<Record<string, boolean>>({});

    const handleRemoveToast = (id) => {
        setClosingToasts((prev) => ({ ...prev, [id]: true }));
    };
    useEffect(() => {
        setExistingToasts(toasts);
    }, [toasts]);

    return (
        <div className={styles.toastsContainer}>
            {existingToasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{
                        top: `${index * 80}px`,
                        transition: 'top 0.3s ease-in-out',
                    }}
                    className={`${styles.toastsContainer__toastWrapper} ${
                        closingToasts[toast.id] ? styles.fadeOut : styles.fadeIn
                    } ${
                        toast.type === 'success' ? styles.toastSuccess
                            : toast.type === 'error' ? styles.toastError
                                : toast.type === 'info' ? styles.toastInfo
                                    : ''
                    }`}
                    onAnimationEnd={() => {
                        if (toast.autoClose) removeToast(toast.id);
                    }}
                >
                    <p>{toast.id}</p>
                </div>
            ))}
        </div>
    );
};

export default Toast;
