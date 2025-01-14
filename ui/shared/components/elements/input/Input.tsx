import styled from 'styled-components';
import React, {FormEvent} from "react";
import {a} from "vite/dist/node/types.d-aGj9QkWt";

const StyledInput = styled.input`
    overflow: hidden;
    background-color: #2a2a5e; 
    border: 2px solid var(--border-color); 
    color: #eaeaea;
    padding: 5px;
    height: 60px;
    border-radius: 8px;
    transition: background-color 0.3s ease, border-color 0.3s ease;
    min-width: 1ch;
    max-width: 100%;
    &:focus {
        background-color: #2a2a5e;
        border-color: #666;
        outline: none;
    }
    &:disabled {
        background-color: #e0e0e0; 
        color: #a0a0a0; 
        border: 1px solid #c0c0c0; 
    }
    &::placeholder {
        color: #888;
        opacity: 0.7;
    }
    
`;

interface IInputProps {
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
    style: any;
}

const Input: React.FC<IInputProps> = ({...props}) => {
    return (
        <StyledInput
            style={props.style}
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