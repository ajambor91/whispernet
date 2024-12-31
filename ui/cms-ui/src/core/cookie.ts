import {ELang} from "@/enums/lang.enum";

export const getLangFromCookies = (req: any): string => {
    const cookies = req.headers.cookie || '';
    const parsedCookies = Object.fromEntries(
        cookies.split('; ').map((cookie) => cookie.split('='))
    );
    return parsedCookies.lang || 'pl';
};


export const setLangCookie = (lang: ELang): void => {
    document.cookie = `lang=${lang}; path=/; max-age=3600; SameSite=Strict`;

}