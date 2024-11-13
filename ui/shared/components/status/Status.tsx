import React, {useEffect, useState} from "react";
import {EClientStatus} from "../../enums/client-status.enum";

interface IStatusProps {
    sessionStatus: EClientStatus;
}

const Status: React.FC<IStatusProps> = ({sessionStatus}) => {
    const [status, setStatus] = useState<EClientStatus | null>("Started connection")
    const getStatus = (): EClientStatus => {
        console.log('connecting', status)
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