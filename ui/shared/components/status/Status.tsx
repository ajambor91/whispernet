import React, {useEffect, useState} from "react";
interface StatusProps {
    isLoading: boolean;
    isConnected: boolean;
    isJoined: boolean;
}

const Status: React.FC<StatusProps> = ({isLoading, isConnected, isJoined}) => {
    const [status, setStatus] = useState<string>("Started connection")
    const getStatus = (): string => {
        if (isJoined) {
            return "Connected with peer";
        } else if (isConnected) {
                return "Connected with signal server, P2P session estabilishing"

        } else  if (isLoading) {
            return 'Connecting to signal server'
        } else if (isConnected) {
            return "Connected with signal server, P2P session estabilishing"
        } else if (isJoined) {
            return "Connected with peer"
        }
    }
    useEffect(() => {
        setStatus(getStatus);
    }, [isLoading, isConnected, isJoined]);
    return (
        <div>
            <p>
                {status}
            </p>
        </div>)
}

export default Status;