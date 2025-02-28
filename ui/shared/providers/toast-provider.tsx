import {createContext, useCallback, useContext, useState} from "react";
import {IToast} from "../models/toast.model";
import {TToastContext} from "../types/toast/toast.type";

const ToastContext = createContext<TToastContext | undefined>(undefined)

export const ToastProvider = ({children}) => {
    const [toasts, setToasts] = useState<IToast<object>[]>([]);
    const addToast = useCallback(({title, description, type, autoClose, customElement, customStyle}) => {
        if (autoClose === undefined || autoClose == null) {
            autoClose = true;
        }
        const id: number = Math.floor(Math.random() * 100000);
        setToasts((prev) => [{id, title, type, description, autoClose, customElement, customStyle}, ...prev]);

    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{addToast, removeToast, toasts}}>
            {children}
        </ToastContext.Provider>
    )
}

export const useToasts = () => useContext(ToastContext)