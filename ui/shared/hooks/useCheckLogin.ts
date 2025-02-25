import {useState} from "react";
import {IUserAuthorization} from "../models/user-authorization.model";
import dataFetch from "../helpers/fetch";

const deleteUserAUthData = () => {
    localStorage.removeItem("userData");
}
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
                deleteUserAUthData();
                setResponse({userAuthorization: false})
            } else {
                setResponse({userAuthorization: true});
            }
        } catch (e: any) {
            deleteUserAUthData();
            setError(e);
        } finally {
            setLoading(false);
        }
    }
    return {checkLogin, response, loading, error};

}
export default useCheckLogin;


