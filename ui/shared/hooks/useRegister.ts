import {useState} from "react";
import {IRegisterRequest} from "../models/register-request.model";
import {IError} from "../models/error.model";

const useRegister = () => {
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<IError | null>(null);


    const register = async (registerData: IRegisterRequest) => {
        let response: Response;
        try {
            response = await fetch(`/api/security/register`, {
                method: 'POST',
                body: JSON.stringify(registerData),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data: any = await response.json();
            if (!response.ok) {
                throw new Error('Failed to register user');
            }
            setResponse(data);

        } catch (e: any) {
            setError({
                message: "Cannot register. Please try again later.",
                status: response.status
            });
        } finally {
            setLoading(false);
        }
    }
    return {register, response, loading, error};

}
export default useRegister;


