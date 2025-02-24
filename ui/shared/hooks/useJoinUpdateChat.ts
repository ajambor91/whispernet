import {useEffect, useState} from "react";
import {IPeerState} from "../slices/createSession.slice";
import {useToasts} from "../providers/toast-provider";
import {IError} from "../models/error.model";
import {logError} from "../error-logger/web";
import {a} from "vite/dist/node/types.d-aGj9QkWt";
import dataFetch from "../helpers/fetch";

const useJoinUpdateChat = () => {
    const [response, setResponse] = useState<IPeerState>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<IError | null>(null);
    const joinUpdateChat = async (peerState: IPeerState) => {
        let response: Response;
        let data: any;
        let errorData: IError;
        let err: any;
        try {
            response = await dataFetch(`/api/session/update/${peerState.sessionToken}`, {method: 'POST',
                body: JSON.stringify(peerState),
                headers: {
                "Content-Type": "application/json"
                }});
            data = await response.json();



        } catch (error: any) {
            console.log("CATHC",error)
            err = error;
            logError({message: "Unauthorized session"})
        } finally {
            if (response.ok) {
                console.log("DATA RESPONMSE", data);
                setResponse(data);
                // /   throw new Error('Failed to found existing chat');
            } else if (response.status === 401) {
                console.log("DATA RESPONMSE 401",err, data);

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

            } else  {                console.log("DATA RESPONMSE err",err, data);


                errorData = {

                    status: response.status ?? err.status,
                    name: err?.name,
                    message: err?.message,
                    stack: err?.stack
                };
                setError(errorData);

            }
            console.log('ERROR', error);
            console.log("FINALLY", data)
            setLoading(false);
        }
    }
    return {joinUpdateChat, response, loading, error};

}
export default useJoinUpdateChat;


