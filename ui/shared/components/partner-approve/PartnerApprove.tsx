import styles from "./PartnerApprove.module.scss";
import React from "react";
import Button from "../elements/button/Button";
import SecondaryHeader from "../elements/secondary-header/SecondaryHeader";


interface IPartnerApproveProps {
    accept: (username: string) => void;
    decline: (username: string) => void;
    partnerName: string;
    partnerKey: string;
}
const PartnerApprove: React.FC<IPartnerApproveProps> = ({accept, decline, partnerName, partnerKey}) => {
    return (
        <div className={styles["container"]}>
            <SecondaryHeader>Conversations confirming</SecondaryHeader>

            <div className={styles["container__pub-container"]}>
                <p className={styles["container__pub-container__name"]}>
                    {partnerName} invites you to chat
                </p>
                <p className={styles["container__pub-container__title"]}>Public key:</p>
                <p className={styles["container__pub-container__key"]}>
                    {partnerKey}
                </p>
            </div>
            <div className={styles["container__buttons"]}>
                <Button onClick={() => decline(partnerName)} className="button-secondary">Decline</Button>
                <Button onClick={() => accept(partnerName)} className="button-primary">Accept</Button>
            </div>
        </div>
    )
}

export default PartnerApprove;