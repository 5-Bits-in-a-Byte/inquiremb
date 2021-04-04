import React from "react";
import styled, { css } from "styled-components";

const Icon = ({ children, loading, onClick, ...props }) => {
  const clickHandler = loading ? undefined : onClick;
  return (
    <Btn {...props} onClick={clickHandler}>
      {loading ? <LoadingDots /> : children}
    </Btn>
  );
};

export default Icon;

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
`;
