import React from "react";
import styles from "./Indicator.module.scss";
const Indicator: React.FC = () => {
    return (
        <div className={styles.indicatorWrapper}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid"
                style={{ background: 'transparent' }}
                width="100"
                height="100"
            >
                <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    stroke="rgb(176, 179, 192)"
                    strokeWidth="10"
                    r="35"
                    strokeDasharray="164.93361431346415 56.97787143782138"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        repeatCount="indefinite"
                        dur="1s"
                        values="0 50 50;360 50 50"
                        keyTimes="0;1"
                    />
                </circle>
                <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    stroke="rgb(136, 139, 152)"
                    strokeWidth="6"
                    r="28"
                    strokeDasharray="131.94689145077132 43.982297150257104"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        repeatCount="indefinite"
                        dur="1.5s"
                        values="0 50 50;-360 50 50"
                        keyTimes="0;1"
                    />
                </circle>
            </svg>
        </div>
    );
};

export default Indicator;
