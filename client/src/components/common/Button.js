import React from "react";
import styled, { css } from "styled-components";

const Button = ({ children, ...props }) => {
  return <Btn {...props}>{children}</Btn>;
};

export default Button;

const Btn = styled.button`
  cursor: pointer;
  border: none;
  border-radius: 4px;
  padding: 5px 12px;
  font-size: 14px;

  // If secondary prop === true
  ${(props) =>
    props.secondary &&
    css`
      background-color: #e7e7e7;
      color: #162b55;

      &:hover {
        background-color: #dedede;
      }
    `}

  // If primary prop === true
    ${(props) =>
    props.primary &&
    css`
      background-color: #4a86fa;
      color: #fff;
    `}
`;
