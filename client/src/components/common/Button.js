import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import LoadingDots from "./animation/LoadingDots";

/**
 * The one true button to rule them all
 *
 * @version 1.0.0
 * @author [Alec Springel](https://github.com/alecspringel) , [Seth Tal](https://github.com/Sephta)
 */
const Button = ({ children, loading, onClick, customStyledCSS, ...props }) => {
  const clickHandler = loading ? undefined : onClick;
  return (
    <>
      {customStyledCSS ? (
        <customStyledCSS onClick={clickHandler}>
          {loading ? <LoadingDots /> : children}
        </customStyledCSS>
      ) : (
        <Btn {...props} onClick={clickHandler}>
          {loading ? <LoadingDots /> : children}
        </Btn>
      )}
    </>
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
  width: ${(props) => (props.autoWidth ? "100%" : props.buttonWidth)};
  height: ${(props) => (props.buttonHeight ? props.buttonHeight : "")};
  display: flex;
  justify-content: center;
  align-items: center;

  transition: ease-in-out 100ms;

  :focus {
    border: 2px solid var(--inquire-blue);
  }

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
  ${(props) =>
    props.outlineSecondary &&
    css`
      border: 2px solid
        ${(props) => (props.buttonColor ? props.buttonColor : css`#4a86fa`)};
      border-radius: 4px;
      padding: 5px 12px;
      background-color: #e7e7e700;
      color: #162b55;
      &:hover {
        transform: ${(props) =>
          props.animatedHover ? css`translateY(-0.5px);` : ""};
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
      }
      &:active {
        transform: ${(props) =>
          props.animatedHover ? css`translateY(1px);` : ""};
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0);
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
      background-color: ${(props) =>
        props.buttonColor ? props.buttonColor : css`#4a86fa`};
      color: #fff;
      &:hover {
        background-color: ${(props) =>
          props.buttonColor ? props.buttonColor : css`#407df3`};
        transform: ${(props) =>
          props.animatedHover ? css`translateY(-0.5px);` : ""};
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
      }
      &:active {
        transform: ${(props) =>
          props.animatedHover ? css`translateY(1px);` : ""};
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0);
      }
    `}

  // If signin prop === true
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
      `}
    ${(props) =>
    props.enableMargin &&
    css`
      margin: ${props.enableMargin};
    `}
`;
