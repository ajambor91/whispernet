declare const useWebSocket: () => {
    isConnected: boolean;
    messages: string[];
    sendToken: (token: string) => void;
};
export default useWebSocket;
