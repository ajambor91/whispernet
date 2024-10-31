import styled from 'styled-components';
import React from "react";

const StyledDiv = styled.div`
    display: inline-block;
`;

interface InlineDivProps extends React.HTMLAttributes<HTMLDivElement> {
}

const InlineDiv: React.FC<InlineDivProps> = ({children}) => {
    return (
        <StyledDiv>
            {children}
        </StyledDiv>
    );
};

export default InlineDiv;