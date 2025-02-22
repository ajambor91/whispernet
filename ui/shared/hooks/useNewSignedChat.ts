import {useState} from "react";
import {ISession} from "../models/ws-message.model";
import dataFetch from "../helpers/fetch";
import {IPeerState} from "../slices/createSession.slice";



const useNewSignedChat = () => {
    const [signedResponse, setSignedResponse] = useState<IPeerState | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const createNewSignedChat = async () => {
        try {
            const res: Response = await dataFetch('/api/session/create-signed', {method: 'POST'});
            if (!res.ok) {
                throw new Error('Failed to create a chat');
            }
            const data: IPeerState = await res.json();
            setSignedResponse(data);
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false);
        }
    }
    return {createNewSignedChat, signedResponse, loading, error};

}
export default useNewSignedChat;