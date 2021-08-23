import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

// import "./css/toolTip.css";

/**
 * @param {*} tooltipText the text contained in the tooltip popup modal.
 * @param {*} customPosition json object to set custom absolute tooltip position around the element its wrapping.
 * @param {*} hoverDelay the time in milliseconds before the tooltip toggled
 * @param {*} debug tells this component to print debug info to the console
 * @brief The customPosition object should look like the following:
 *  { top: "value", right: "value", bottom: "value", left: "value" }
 */
const InquireTooltip = ({
  children,
  tooltipText,
  customPosition,
  hoverDelay,
  debug,
  ...props
}) => {
  const [hoverState, setHoverState] = useState(false);

  useEffect(() => {
    debug && console.log(props.id, hoverState);
  }, [hoverState]);

  return (
    <>
      <TooltipContainer
        onMouseEnter={(event) => {
          debug && event && console.log(event);

          if (hoverDelay)
            setTimeout(() => {
              setHoverState(true);
            }, hoverDelay);
          else setHoverState(true);
        }}
        onMouseLeave={(event) => {
          debug && event && console.log(event);

          if (hoverDelay)
            setTimeout(() => {
              setHoverState(false);
            }, hoverDelay);
          else setHoverState(false);
        }}
        showTooltip={hoverState}
        customPosition={customPosition}
      >
        {children}
        {tooltipText ? <p id="tooltip-text">{tooltipText}</p> : <></>}
      </TooltipContainer>
    </>
  );
};

export default InquireTooltip;

const TooltipContainer = styled.div`
  position: relative;

  #tooltip-text {
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    position: absolute;

    ${(props) =>
      props.customPosition?.top
        ? css`
            top: ${props.customPosition.top};
          `
        : css`
            top: 0;
          `};

    ${(props) =>
      props.customPosition?.right
        ? css`
            right: ${props.customPosition.right};
          `
        : css`
            right: auto;
          `};

    ${(props) =>
      props.customPosition?.bottom
        ? css`
            bottom: ${props.customPosition.bottom};
          `
        : css`
            bottom: auto;
          `};

    ${(props) =>
      props.customPosition?.left
        ? css`
            left: ${props.customPosition.left};
          `
        : css`
            left: 100%;
          `};

    width: 250px;
    min-height: 25%;
    padding: 0.25em;

    border-radius: 4px;
    border: 2px solid #e7e7e7;

    box-shadow: 0px 0.25em 0.5em 0.125em rgb(0 0 0 / 25%);

    background-color: #f8f8f8;
    color: #162b55;
    visibility: ${(props) => (props.showTooltip ? css`visible` : css`hidden`)};

    transition: 150ms ease-in-out;
  }
`;

// ::after {
//       display: inline-block;
//       width: 50%;
//       /* height: 25px; */
//       position: absolute;
//       top: calc(50% - 8px);
//       left: -160%;
//       content: "";
//       /* background-color: #f8f8f8; */
//       border-top: 8px solid transparent;
//       border-right: 16px solid #e7e7e7;
//       border-bottom: 8px solid transparent;
//     }
