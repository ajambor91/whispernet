import styled from 'styled-components';
import React, {FormEvent} from "react";

const StyledInput = styled.input`
    background-color: #2a2a5e; 
    border: 2px solid var(--border-color); 
    color: #eaeaea;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 16px;
    transition: background-color 0.3s ease, border-color 0.3s ease;

    &:focus {
        background-color: #2a2a5e;
        border-color: #666;
        outline: none;
    }

    &::placeholder {
        color: #888;
        opacity: 0.7;
    }
`;

interface InputProps {
    value: string;
    type: any;
    onChange?: (event: FormEvent<any>) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    name?: string;
    id?: string;
    maxLength?: number;
    minLength?: number;
    autoFocus?: boolean;
    required?: boolean;
    readOnly?: boolean;
    autoComplete?: "on" | "off";
}

const Input: React.FC<InputProps> = ({...props}) => {
    return (
        <StyledInput
            type={props.type}
            value={props.value}
            onChange={props.onChange}
            disabled={props.disabled}
            placeholder={props.placeholder}
            className={props.className}
            name={props.name}
            id={props.id}
            maxLength={props.maxLength}
            minLength={props.minLength}
            autoFocus={props.autoFocus}
            required={props.required}
            readOnly={props.readOnly}
            autoComplete={props.autoComplete}
        />
    );
};

export default Input;