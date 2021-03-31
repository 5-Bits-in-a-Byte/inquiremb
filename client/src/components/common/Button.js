import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import LoadingDots from "./animation/LoadingDots";

const Button = ({ children, loading, onClick, ...props }) => {
  const clickHandler = loading ? undefined : onClick;
  return (
    <Btn {...props} onClick={clickHandler}>
      {loading ? <LoadingDots /> : children}
    </Btn>
  );
};

Button.propTypes = {
  /* Styles the button as a primary button */
  primary: PropTypes.bool,
  /* Styles the button as a secondary button */
  secondary: PropTypes.bool,
  /* Makes the button width === 100% */
  autoWidth: PropTypes.bool,
  /* Replaces the button label with a loading indicator and prevents onClick */
  loading: PropTypes.bool,
};

export default Button;

const Btn = styled.button`
  cursor: pointer;
  border: none;
  padding: 9px 12px;
  border-radius: 3px;

  font-size: 16px;
  width: ${(props) => props.autoWidth && "100%"};
  display: flex;
  justify-content: center;
  align-items: center;

  // If secondary prop === true
  ${(props) =>
    props.secondary &&
    css`
      border-radius: 4px;
      padding: 5px 12px;
      background-color: #e7e7e7;
      color: #162b55;
      &:hover {
        background-color: #dedede;
      }
    `}

  // If largeSecondary prop === true
  ${(props) =>
    props.largeSecondary &&
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
        &:hover {
          background-color: #407df3;
        }
      `}

    ${(props) =>
      props.signin &&
      css`
        background-color: transparent;
        color: #fff;
        width: 10%;
        &:hover {
          background-color: white;
          opacity: 0.85;
          color: black;
      `}}
`;
