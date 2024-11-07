import React, {useEffect, useState} from "react";

interface StatusProps {
    sessionStatus: string;
}

const Status: React.FC<StatusProps> = ({sessionStatus}) => {
    const [status, setStatus] = useState<string>("Started connection")
    const getStatus = (): string => {
      return sessionStatus;
    }
    useEffect(() => {
        setStatus(getStatus);
    }, [status]);
    return (
        <div>
            <p>
                {status}
            </p>
        </div>)
}

export default Status;