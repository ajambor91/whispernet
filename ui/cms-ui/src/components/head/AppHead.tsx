import Head from "next/head";
import {ELang} from "@/enums/lang.enum";
import React from "react";
import {useTranslation} from "next-i18next";

export interface IHeadProps {
    lang: ELang
}
const AppHead: React.FC<IHeadProps> = ({lang}) => {

    const {t} = useTranslation();
    return (
        <Head>
            <title>{t("title")}</title>

            <meta name="keywords" content="encrypted messaging, secure chat, online privacy, end-to-end encryption, WhisperNet" />

            <meta name="author" content="WhisperNet Team" />

            <meta name="viewport" content="width=device-width, initial-scale=1" />

            <meta name="robots" content="index, follow" />

        </Head>
    )
}

export default AppHead;