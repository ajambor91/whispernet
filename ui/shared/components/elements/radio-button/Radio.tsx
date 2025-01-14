import styled from "styled-components";
import React, { useRef, useState } from "react";

const RadioContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-top: 20px;
`;

const RadioInput = styled.input`
    display: none;
`;

const RadioLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    color: #ccc;
    font-size: 1rem;
    font-family: 'Arial', sans-serif;

    &:hover span {
        border-color: #00bcd4;
    }
`;

const RadioCustom = styled.span`
    width: 20px;
    height: 20px;
    border: 2px solid #fff;
    border-radius: 50%;
    background-color: transparent;
    transition: background-color 0.3s, border-color 0.3s;

    ${RadioInput}:checked + ${RadioLabel} & {
        background-color: #00bcd4;
        border-color: #00bcd4;
    }
`;

export interface IRadioOption {
    label: string;
    name: string;
    value: string;
    id: string;
}

export interface IRadioProps {
    options: IRadioOption[];
    valueChange: (option: string) => void;
}

const Radio: React.FC<IRadioProps> = ({ options, valueChange }) => {
    const [currentValue, setCurrentValue] = useState<string | undefined>();
    const refs = useRef<Map<string, HTMLInputElement>>(new Map());

    const onChange = (option: IRadioOption) => {
        const allOptions = Array.from(refs.current.values());

        allOptions.forEach((input) => {
            input.checked = input.value === option.value;
        });

        setCurrentValue(option.value);
        valueChange(option.value);
    };

    return (
        <RadioContainer>
            {options.map((option) => (
                <div key={option.id}>
                    <RadioInput
                        ref={(el) => {
                            if (el) {
                                refs.current.set(option.id, el);
                            } else {
                                refs.current.delete(option.id);
                            }
                        }}
                        type="radio"
                        id={option.id}
                        name={option.name}
                        value={option.value}
                        onChange={() => onChange(option)}
                    />
                    <RadioLabel htmlFor={option.id}>
                        <RadioCustom />
                        {option.label}
                    </RadioLabel>
                </div>
            ))}
        </RadioContainer>
    );
};

export default Radio;
