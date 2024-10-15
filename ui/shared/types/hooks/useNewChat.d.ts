declare const useNewChat: () => {
    createNewChat: () => Promise<any>;
    response: any;
    loading: boolean;
    error: string | null;
};
export default useNewChat;
