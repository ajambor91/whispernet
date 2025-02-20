import styled from 'styled-components';
import React from "react";

const StyledPrimaryHeader = styled.h1`

    @media screen and (max-width: 728px){
        font-size: 40px;

    }
    font-size: 50px;
    font-weight: 900;
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