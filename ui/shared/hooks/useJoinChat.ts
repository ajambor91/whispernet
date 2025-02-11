import {useEffect, useState} from "react";
import {IPeerState} from "../slices/createSession.slice";
import {useToasts} from "../providers/toast-provider";
import {IError} from "../models/error.model";

const useJoinChat = () => {
    const [response, setResponse] = useState<IPeerState>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<IError | null>(null);
    const joinChat = async (wsToken: string) => {
        let response: Response;
        try {
            response = await fetch(`/api/session/exists/${wsToken}`, {method: 'POST'});
            const data: any = await response.json();
            if (!response.ok) {
                throw new Error('Failed to found existing chat');
            }
            setResponse(data);

        } catch (e: any) {
            setError({message: "Cannot join to chat. Please try again later.", status: response.status});
        } finally {
            setLoading(false);
        }
    }
    return {joinChat, response, loading, error};

}
export default useJoinChat;


