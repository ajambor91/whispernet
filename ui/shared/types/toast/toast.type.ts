import {IToast} from "../../models/toast.model";

export type TAddToastParams<T> = Omit<IToast<T>, 'id'>;

export type TToastContext = {
    addToast: (toast: TAddToastParams<object>) => void;
    removeToast: (id: number) => void;
    toasts: IToast<object>[];
}