import React, {useEffect, useState} from "react";

interface IStatusProps {
    sessionStatus: string;
}

const Status: React.FC<IStatusProps> = ({sessionStatus}) => {
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