import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";

const Button = ({ children, ...props }) => {
  return <Btn {...props}>{children}</Btn>;
};

Button.propTypes = {
  /* Styles the button as a primary button */
  primary: PropTypes.bool,
  /* Styles the button as a secondary button */
  secondary: PropTypes.bool,
  /* Makes the button width === 100% */
  autoWidth: PropTypes.bool,
};

export default Button;

const Btn = styled.button`
  cursor: pointer;
  border: none;
  border-radius: 4px;
  padding: 5px 12px;
  font-size: 14px;
  width: ${(props) => props.autoWidth && "100%"};

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
      padding: 7px 12px;
      border-radius: 3px;
      background-color: #4a86fa;
      color: #fff;

      &:hover {
        background-color: #407df3;
      }
    `}
`;
