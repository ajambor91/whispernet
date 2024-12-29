import styled from 'styled-components';
import React from "react";

const StyledButton = styled.button`
    height: 60px;
    padding: 5px 30px;
    font-size: 18px;
    font-weight: bold;
    color: #b0b3c0;
    background-color: transparent;
    border: 2px solid #b0b3c0; 
    border-radius: 8px; 
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
        background-color: #231a69;
        color: #fff; 
    }

    &:active {
        background-color: #4a4aa3; 
        transform: translateY(0);
    }
`;

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className: 'primary' | 'secondary' | string;
}

const Button: React.FC<IButtonProps> = ({children, className, ...props}) => {
    return (
        <StyledButton className={`button ${className}`} {...props}>
            {children}
        </StyledButton>
    );
};

export default Button;