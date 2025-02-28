import styled from "styled-components";
import React, {useRef, useState} from "react";

const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-top: 20px;
`;

const CheckboxInput = styled.input`

    display: none;
`;


const CheckboxLabel = styled.label`
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

const CheckboxCustom = styled.span`
    width: 20px;
    height: 20px;
    border: 2px solid #fff;
    border-radius: 4px;
    background-color: transparent;
    transition: background-color 0.3s, border-color 0.3s;

    ${CheckboxInput}:checked + ${CheckboxLabel} & {
        background-color: #00bcd4;
        border-color: #00bcd4;
    }

    
    ${CheckboxInput}:checked + ${CheckboxLabel} &::after {
        transform: translate(-50%, -50%) scale(1);
    }
`;

export interface ICheckboxOption {
    label: string;
    name: string;
    value: string;
    id: string;
}

export interface ICheckboxProps {
    options: ICheckboxOption[];
    valueChange: (selectedValues: string[]) => void;
}

const Checkbox: React.FC<ICheckboxProps> = ({options, valueChange}) => {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const refs = useRef<Map<string, HTMLInputElement>>(new Map());

    const onChange = (option: ICheckboxOption) => {
        const allOptions = Array.from(refs.current.values());
        const newSelectedValues = allOptions
            .filter((input) => input.checked)
            .map((input) => input.value);

        setSelectedValues(newSelectedValues);
        valueChange(newSelectedValues);
    };

    return (
        <CheckboxContainer>
            {options.map((option) => (
                <div key={option.id}>
                    <CheckboxInput
                        ref={(el) => {
                            if (el) {
                                refs.current.set(option.id, el);
                            } else {
                                refs.current.delete(option.id);
                            }
                        }}
                        type="checkbox"
                        id={option.id}
                        name={option.name}
                        value={option.value}
                        onChange={() => onChange(option)}
                    />
                    <CheckboxLabel htmlFor={option.id}>
                        <CheckboxCustom/>
                        {option.label}
                    </CheckboxLabel>
                </div>
            ))}
        </CheckboxContainer>
    );
};

export default Checkbox;