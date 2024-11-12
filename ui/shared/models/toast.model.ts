import React, {CSSProperties} from "react";

export interface IToast<T> {
    id?: number;
    title: string;
    description?: string;
    customStyle?: CSSProperties;
    customElement?: React.FC<T>

}