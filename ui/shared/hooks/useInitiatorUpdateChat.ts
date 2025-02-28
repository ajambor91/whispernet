import {useState} from "react";
import {IPeerState} from "../slices/createSession.slice";
import {IError} from "../models/error.model";
import {logError} from "../error-logger/web";
import dataFetch from "../helpers/fetch";
import {IPartners} from "../slices/partners-keys.slice";

const useInitiatorUpdateChat = () => {
    const [response, setResponse] = useState<IPeerState & Partial<IPartners>>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<IError | null>(null);
    const initiatorUpdateChat = async (peerState: IPeerState) => {
        let response: Response;
        let data: any;
        let errorData: IError;
        let err: any;
        try {
            response = await dataFetch(`/api/session/update/initiator/${peerState.sessionToken}`, {
                method: 'PUT',
                body: JSON.stringify(peerState),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            data = await response.json();


        } catch (error: any) {
            err = error;
            logError({message: "Unauthorized session"})
        } finally {
            if (response.ok) {
                setResponse(data);
            } else if (response.status === 401) {
                errorData = {
                    status: response.status ?? err?.status,
                    name: err?.name,
                    message: err?.message,
                    stack: err?.stack,
                    sessionToken: data.sessionToken,
                    sessionAuthType: data.sessionAuthType,
                    peerRole: data.peerRole,
                    secretKey: data.secretKey,
                    isSigned: data.isSigned
                }
                setError(errorData);

            } else {
                errorData = {

                    status: response.status ?? err.status,
                    name: err?.name,
                    message: err?.message,
                    stack: err?.stack
                };
                setError(errorData);

            }

            setLoading(false);
        }
    }
    return {initiatorUpdateChat, response, loading, error};

}
export default useInitiatorUpdateChat;


