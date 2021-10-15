import React, { Children, useContext } from "react";
import styled from "styled-components";
import { ColorContext } from "../context/ColorModeContext";

/**
 * Intented to be used above "Input" components to label them
 */
const InputLabel = ({ children, margin }) => {
  const theme = useContext(ColorContext);
  return (
    <Label theme={theme} margin={margin}>
      {children}
    </Label>
  );
};

export default InputLabel;

const Label = styled.h3`
  color: ${(props) => props.theme.logoFontColor};
  font-size: 16px;
  font-weight: 500;
  margin: ${(props) => props.margin || "13px 0 7px 0"};
`;
