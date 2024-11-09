import styled from 'styled-components';
import React from "react";

const StyledDiv = styled.div`
    display: inline-block;
`;

interface IInlineDivProps extends React.HTMLAttributes<HTMLDivElement> {
}

const InlineDiv: React.FC<IInlineDivProps> = ({children}) => {
    return (
        <StyledDiv>
            {children}
        </StyledDiv>
    );
};

export default InlineDiv;