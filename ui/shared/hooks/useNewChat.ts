import {useState} from "react";
import {ISession} from "../models/ws-message.model";

interface IPeerState {
    session: ISession;
    peerRole: string
}

const useNewChat = () => {
    const [response, setResponse] = useState<IPeerState | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const createNewChat = async () => {
        try {
            const res: Response = await fetch('/api/session/create', {method: 'POST'});
            if (!res.ok) {
                throw new Error('Failed to create a chat');
            }
            const data: IPeerState = await res.json();
            setResponse(data);
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false);
        }
    }
    return {createNewChat, response, loading, error};

}
export default useNewChat;