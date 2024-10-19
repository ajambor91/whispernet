import styled from 'styled-components';
import React from "react";

const StyledButton = styled.button`
    margin: 10px;
    padding: 10px 30px;
    font-size: 18px;
    font-weight: bold;
    color: #cfcfcf; /* Tekst podobny do tego z obrazka */
    background-color: transparent; /* Przezroczyste tło */
    border: 2px solid #cfcfcf; /* Obramowanie w kolorze tekstu */
    border-radius: 8px; /* Delikatne zaokrąglenie */
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #5757ff; /* Niebieskie tło na hover */
        color: #fff; /* Biały tekst na hover */
        transform: translateY(-2px); /* Lekko podnosi się na hover */
    }

    &:active {
        background-color: #4a4aa3; /* Ciemniejsze niebieskie na kliknięcie */
        transform: translateY(0); /* Reset transformacji */
    }
`;
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    className: 'primary' | 'secondary';
}
const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
    return (
        <StyledButton className={`button ${className}`} {...props}>
            {children}
        </StyledButton>
    );
};

export default Button;