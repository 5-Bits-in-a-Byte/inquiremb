import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

const FadeIn = ({ children, delay, speed, ...rest }) => {
  const [isFaded, activate] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      activate(true);
    }, delay || 100);
  }, []);
  return (
    <Animation {...rest} condition={isFaded} speed={speed}>
      {children}
    </Animation>
  );
};

export default FadeIn;

const Animation = styled.div`
  opacity: 0;
  transition: ${(props) =>
    "opacity " +
    (props.speed || 200) +
    "ms ease-in-out, transform " +
    (props.speed || 200) +
    "ms ease-in-out"};
  ${(props) =>
    props.condition &&
    css`
      opacity: 1;
      transform: translateY(-20px);
    `};
`;
