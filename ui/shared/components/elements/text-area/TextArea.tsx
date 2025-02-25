import styled from "styled-components";
import React, {Ref} from "react";

const TextareaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;
  margin-top: 20px;
`;

const TextareaLabel = styled.label`
  color: #ccc;
  font-size: 1rem;
  font-family: 'Arial', sans-serif;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  height: 100px; 
  padding: 5px;
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  color: #fff;
  font-family: 'Arial', sans-serif;
  resize: none;
  transition: border-color 0.3s, background-color 0.3s;

  &:focus {
    outline: none;
    border-color: #00bcd4;
    background-color: rgba(0, 188, 212, 0.1);
  }

  &::placeholder {
    color: #777;
  }
`;

interface ITextAreaProps {
    ref?: Ref<any>;
    label?: string;
    placeholder?: string;
    style?: any;
    onChange?: (event: any) => void
}

const Textarea: React.FC<ITextAreaProps> = ({label, placeholder, style, ref, onChange}) => {
    return (
        <TextareaContainer>
            <TextareaLabel>{label}</TextareaLabel>
            <StyledTextarea onChange={onChange} ref={ref} style={style} placeholder={placeholder}/>
        </TextareaContainer>
    );
};

export default Textarea;
