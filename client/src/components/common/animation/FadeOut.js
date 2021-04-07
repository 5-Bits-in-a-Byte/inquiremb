import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

/** FadOut Component
 * A component to hold children, acts as a fade-out transition / overlay to
 * smoothly fade-in all children of this component.
 *
 * @param {object} children all child components of this fade-out component
 * @param {number} delay the time delay for the fade-out animation
 * @param {number} speed the animation speed of the fade-out transition
 * @param {?} rest I have no idea what this does?
 * @returns Animated set of components that fade-in to the screen
 */
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
