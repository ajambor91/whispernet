import {ILoginResponse} from "../models/login-response.model";

const dataFetch = async (url: string, options: RequestInit = {}) => {
    const userData: ILoginResponse = JSON.parse(localStorage.getItem("userData"));
    let headers: any;
    if (userData) {
        headers = {
            ...options.headers,
            Authorization: `Bearer ${userData.message}`,
            Username: userData.username
        };
    } else {
        headers = {
            ...options.headers
        };
    }

    const updatedOptions = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, updatedOptions as RequestInit);
        if (response.status === 401) {
            console.error("Unauthorized! JWT might have expired.");
        }

        return response;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

export default dataFetch;
