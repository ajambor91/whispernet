declare const useJoinChat: () => {
    joinChat: (wsToken: string) => Promise<any>;
    response: any;
    loading: boolean;
    error: string | null;
};
export default useJoinChat;
