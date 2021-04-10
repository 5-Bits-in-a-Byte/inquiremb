import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const Icon = ({ clickable, iconImg, onClick, altMsg, width, ...props }) => {
  const clickHandler = clickable ? onClick : undefined;
  return (
    <IconDiv {...props} onClick={clickHandler}>
      <img src={iconImg} alt={altMsg} width={width} />
    </IconDiv>
  );
};

Icon.propTypes = {
  /* Styles the icon to fade in and out on hover */
  fader: PropTypes.bool,
  /* Makes the icon width === 100% */
  autoWidth: PropTypes.bool,
};

export default Icon;

const IconDiv = styled.div`
  cursor: ${(props) => (props.onClick === undefined ? "default" : "pointer")};
  border: none;
  // padding: 9px 12px;
  // border-radius: 3px;

  // font-size: 16px;
  width: ${(props) => props.autoWidth && "100%"};
  display: flex;
  justify-content: center;
  align-items: center;

  // If fader prop === true
  ${(props) =>
    props.fader &&
    css`
      &:hover {
        opacity: 50%;
      }
    `}
`;
