import styled from 'styled-components';
import React from "react";
import '../../../styles/vars.scss'
const StyledTertiaryHeader = styled.h1`
    font-size: var(--tertiary-header-font-size);
    font-weight: var(--tertiary-header-font-weight);
    text-align: center;

`;

const TertiaryHeader: React.FC = ({ children }) => {
    return (
        <StyledTertiaryHeader>
            {children}
        </StyledTertiaryHeader>
    );
};

export default TertiaryHeader;