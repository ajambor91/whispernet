import {useState} from "react";

import {IInitializeLogin} from "../models/initialize-login.model";
import {IInitializedLoginResponse} from "../models/initialized-login-response.model";
import {IError} from "../models/error.model";

const useInitLogin = () => {
    const [response, setResponse] = useState<IInitializedLoginResponse>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<IError | null>(null);
    const initLogin = async (initLogin: IInitializeLogin) => {
        let response: Response;
        try {
            response = await fetch(`/api/security/initialize-login`, {
                method: 'POST',
                body: JSON.stringify(initLogin),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data: IInitializedLoginResponse = await response.json();
            if (!response.ok) {
                throw new Error('Failed to found user');
            }
            setResponse(data);

        } catch (e: any) {
            setError({
                message: "Cannot initialize login. Please try again later",
                status: response.status
            });
        } finally {
            setLoading(false);
        }
    }
    return {initLogin, response, loading, error};

}
export default useInitLogin;


