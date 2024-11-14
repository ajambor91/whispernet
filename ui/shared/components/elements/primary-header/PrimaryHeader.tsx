import styled from 'styled-components';
import React from "react";
import '../../../styles/vars.scss'

const StyledPrimaryHeader = styled.h1`
    font-size: var(--main-header-font-size);
    font-weight: var(--main-header-font-weight);
    text-align: center;

`;
interface IHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: string;
}
const PrimaryHeader: React.FC<IHeaderProps> = ( {children, ...props }) => {
    return (
        <StyledPrimaryHeader {...props}>
            {children}
        </StyledPrimaryHeader>
    );
};

export default PrimaryHeader;