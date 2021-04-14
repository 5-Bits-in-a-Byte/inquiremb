import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

/** FadIn Component
 * A component to hold children, acts as a fade-in transition / overlay to
 * smoothly fade-in all children of this component.
 *
 * @param {object} children all child components of this fade-in component
 * @param {number} delay the time delay for the fade-in animation
 * @param {number} speed the animation speed of the fade-in transition
 * @param {?} rest I have no idea what this does?
 * @returns Animated set of components that fade-in to the screen
 */
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
