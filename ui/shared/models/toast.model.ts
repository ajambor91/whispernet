import React, {CSSProperties} from "react";

export interface IToast<T> {
    id?: number;
    type: string;
    title: string;
    autoClose?: boolean
    description?: string;
    customStyle?: CSSProperties;
    customElement?: React.FC<T>

}