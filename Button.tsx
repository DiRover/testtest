import React, {FC} from 'react';
import styled from "@emotion/styled";

interface Props {
    type: 'submit'
}

const StyledButton = styled.button`
appearance: none;
  width: 100%;
  border: none;
  &:hover {
    background-color: #61dafb;
  },
  &:active {
    border: 1px solid black;
  }
`;

const Button: FC<Props> = ({children, type}): JSX.Element => {
    return (
            <StyledButton type={type}>{children}</StyledButton>
    );
};

export default Button;