import {apiURL, isDockerized} from "@/api/consts";

export const getUrl = (path: string, isSSR: boolean): string => {
    if (!isDockerized) {
        return `http://127.0.0.1:9099${path}`;
    }
    if (isSSR) {
        return `https://gateway-cms${path}`;
    }
    return `${apiURL}${path}`;
}
