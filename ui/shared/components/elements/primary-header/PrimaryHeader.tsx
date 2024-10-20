import styled from 'styled-components';
import React from "react";
import '../../../styles/vars.scss'
const StyledTertiaryHeader = styled.h3`
    font-size: var(--main-header-font-size);
    font-weight: var(--main-header-font-weight);
    text-align: center;

`;

const PrimaryHeader: React.FC = ({ children }) => {
    return (
        <StyledTertiaryHeader>
            {children}
        </StyledTertiaryHeader>
    );
};

export default PrimaryHeader;