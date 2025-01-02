import {apiURL} from "@/api/consts";

export const getUrl = (path: string): string => `${apiURL}${path}`;
