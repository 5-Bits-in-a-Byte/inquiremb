import React from "react";
import styled from "styled-components";

/** Dots Component
 * An animation of divs bobbing up and down linearly.
 *
 * @param {number} size the number of dots in the loading animation.
 * @param {string} color the color of the dots in the animation.
 * @returns A wrapped linear series of circular divs that animate to indicate loading.
 */
const LoadingDots = ({ size = 8, color }) => {
  return (
    <Wrapper color={color}>
      <Dot size={size} delay={0} />
      <Dot size={size} delay={100} />
      <Dot size={size} delay={200} />
    </Wrapper>
  );
};

export default LoadingDots;

const Wrapper = styled.div`
  display: flex;

  div {
    background-color: ${(props) => props.color || "#fff"};
  }
`;

const Dot = styled.div`
  height: ${(props) => props.size + "px"};
  width: ${(props) => props.size + "px"};
  border-radius: ${(props) => props.size / 2 + "px"};
  margin: ${(props) => props.size * 0.3 + "px"};

  @keyframes inout {
    from {
      transform: scale(1);
    }

    50% {
      transform: scale(1.35);
    }

    to {
      transform: scale(1);
    }
  }

  animation-name: inout;
  animation-delay: ${(props) => props.delay + "ms"};
  animation-iteration-count: infinite;
  animation-direction: forward;
  animation-duration: 850ms;
`;
