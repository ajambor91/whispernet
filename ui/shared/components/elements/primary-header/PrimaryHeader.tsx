import styled from 'styled-components';
import React from "react";
import '../../../styles/vars.scss'
const StyledPrimaryHeader = styled.h3`
    font-size: var(--main-header-font-size);
    font-weight: var(--main-header-font-weight);
    text-align: center;

`;

const PrimaryHeader: React.FC<any> = ({ children }) => {
    return (
        <StyledPrimaryHeader>
            {children}
        </StyledPrimaryHeader>
    );
};

export default PrimaryHeader;