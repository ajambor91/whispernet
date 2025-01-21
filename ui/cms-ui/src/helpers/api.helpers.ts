import {apiURL} from "@/api/consts";

export const getUrl = (path: string, isSSR: boolean): string => !isSSR ?`${apiURL}${path}` : `https://gateway${path}`;
