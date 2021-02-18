import React from "react";
import styled, { css } from "styled-components";

const Button = ({ children, ...props }) => {
  return <Btn {...props}>{children}</Btn>;
};

export default Button;

const Btn = styled.button`
  ${(props) =>
    props.secondary &&
    css`
      cursor: pointer;
      background-color: #e7e7e7;
      color: #162b55;
      border: none;
      padding: 5px 12px;
      border-radius: 4px;
      font-size: 14px;
      border: none;

      &:hover {
        background-color: #dedede;
      }
    `}
`;
