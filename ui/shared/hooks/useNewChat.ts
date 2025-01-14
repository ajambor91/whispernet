import {useState} from "react";
import {ISession} from "../models/ws-message.model";
import dataFetch from "../helpers/fetch";
import {IError} from "../models/error.model";

interface IPeerState {
    sessionToken: string;
    peerRole: string
    secretKey: string;
}

const useNewChat = () => {
    const [response, setResponse] = useState<IPeerState | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [newChatError, setNewChatError] = useState<IError | null>(null);
    const createNewChat = async () => {
        let res: Response;
        try {
            res = await dataFetch('/api/session/create', {method: 'POST'});
            if (!res.ok) {
                throw new Error('Failed to create a chat');
            }
            const data: IPeerState = await res.json();
            setResponse(data);
        } catch (e: Error) {

            setNewChatError({
                message: e.message,
                status: res.status

            })
        } finally {
            setLoading(false);
        }
    }
    return {createNewChat, response, loading, newChatError};

}
export default useNewChat;