import styled from 'styled-components';
import React from "react";
import '../../../styles/vars.scss'

const StyledTertiaryHeader = styled.h3`
    font-size: var(--tertiary-header-font-size);
    font-weight: var(--tertiary-header-font-weight);
    text-align: center;

`;
interface IHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: string;
}
const TertiaryHeader: React.FC<IHeaderProps> = ( {children, ...props }) => {
    return (
        <StyledTertiaryHeader  {...props}>
            {children}
        </StyledTertiaryHeader>
    );
};

export default TertiaryHeader;