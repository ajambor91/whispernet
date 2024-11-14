import styled from 'styled-components';
import React from "react";
import '../../../styles/vars.scss'

const StyledSecondaryHeader = styled.h1`
    font-size: var(--secondary-header-font-size);
    font-weight: var(--secondary-header-font-weight);
    text-align: center;
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