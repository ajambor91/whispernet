import React, {CSSProperties} from "react";

export interface IToast<T> {
    id?: number;
    type: "error" | "info" | "success";
    title: string;
    autoClose?: boolean
    description?: string;
    customStyle?: CSSProperties;
    customElement?: React.FC<T>

}