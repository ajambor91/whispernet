import {useState} from "react";

import {IInitializeLogin} from "../models/initialize-login.model";
import {IInitializedLoginResponse} from "../models/initialized-login-response.model";
import {IUserAuthorization} from "../models/user-authorization.model";
import dataFetch from "../helpers/fetch";

const useCheckLogin = () => {
    const [response, setResponse] = useState<IUserAuthorization>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const checkLogin = async () => {
        try {
            const response: Response = await dataFetch(`/api/security/check-login`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                setResponse({userAuthorization: false})
            } else  {
                setResponse({userAuthorization: true});
            }
        } catch (e: any) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }
    return {checkLogin, response, loading, error};

}
export default useCheckLogin;


