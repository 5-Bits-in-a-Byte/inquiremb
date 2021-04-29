import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const Icon = ({ src, onClick, msg, width, ...props }) => {
  const clickHandler = props.clickable ? onClick : undefined;
  return (
    <IconDiv {...props} onClick={clickHandler}>
      <img src={src} alt={msg} width={width} />
    </IconDiv>
  );
};

Icon.propTypes = {
  /* Styles the icon to fade in and out on hover */
  fader: PropTypes.bool,
  /* Makes the icon width === 100% */
  autoWidth: PropTypes.bool,
  /* Enables clicking */
  clickable: PropTypes.bool,
};

export default Icon;

const IconDiv = styled.div`
  cursor: ${(props) => (props.onClick === undefined ? "inherit" : "pointer")};
  border: none;
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
