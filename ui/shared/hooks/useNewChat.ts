import {useState} from "react";

const useNewChat = () => {
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createNewChat = async () => {
        try {
            const res: Response = await fetch('/api/session/create',  { method: 'POST' });
            if(!res.ok) {
                throw new Error('Failed to create a chat');
            }
            const data = await res.json();
            return data;
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false);
        }
    }
    return { createNewChat, response, loading, error };

}

export default useNewChat;