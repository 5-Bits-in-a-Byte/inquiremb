import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

const FadeOut = ({ children, condition, delay, speed, ...rest }) => {
  const [isFaded, activate] = useState(false);
  useEffect(() => {
    if (condition) {
      setTimeout(() => {
        activate(true);
      }, delay || 100);
    }
  });
  return !isFaded ? (
    <Animation {...rest} condition={condition} speed={speed}>
      {children}
    </Animation>
  ) : null;
};

export default FadeOut;

const Animation = styled.div`
  transition: ${(props) =>
    "opacity " +
    (props.speed || 100) +
    "ms ease-in-out, transform " +
    (props.speed || 100) +
    "ms ease-in-out"};
  ${(props) =>
    props.condition &&
    css`
      opacity: 0;
      transform: translateY(50px);
    `};
`;
