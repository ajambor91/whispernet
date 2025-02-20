import styled from 'styled-components';
import React from "react";

const StyledSecondaryHeader = styled.h2`
    font-size: 30px;
    font-weight: 600;
    text-align: center;
    @media screen and (max-width: 728px){
        font-size: 25px;

    }
`;
interface IHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: string;
}
const SecondaryHeader: React.FC<IHeaderProps> = ( {children, ...props }) => {
    return (
        <StyledSecondaryHeader  {...props}>
            {children}
        </StyledSecondaryHeader>
    );
};

export default SecondaryHeader;