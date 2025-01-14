import {useState} from "react";

import {ILoginMessage} from "../models/login-message.model";
import dataFetch from "../helpers/fetch";
import {ILoginResponse} from "../models/login-response.model";
import {IError} from "../models/error.model";

const useLogin = () => {
    const [response, setResponse] = useState<ILoginResponse>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<IError | null>(null);
    const login = async (initLogin: ILoginMessage) => {

        let response: Response;
        try {
             response = await dataFetch(`/api/security/login`, {
                method: 'POST',
                body: JSON.stringify(initLogin),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data: ILoginResponse = await response.json();
            if (!response.ok) {
                throw new Error('Failed to verify signature');
            }
            setResponse(data);

        } catch (e: any) {
            setError({
                message: "Cannot login",
                status: response.status
            });
        } finally {
            setLoading(false);
        }
    }
    return {login, response, loading, error};

}
export default useLogin;


