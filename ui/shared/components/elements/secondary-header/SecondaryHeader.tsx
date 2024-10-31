import styled from 'styled-components';
import React from "react";
import '../../../styles/vars.scss'

const StyledSecondaryHeader = styled.h1`
    font-size: var(--secondary-header-font-size);
    font-weight: var(--secondary-header-font-weight);
    text-align: center;
`;

const SecondaryHeader: React.FC<any> = ({children}) => {
    return (
        <StyledSecondaryHeader>
            {children}
        </StyledSecondaryHeader>
    );
};

export default SecondaryHeader;