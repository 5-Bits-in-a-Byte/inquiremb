import React, { Children } from "react";
import styled from "styled-components";

/* Intented to be used above "Input" components to label them */
const InputLabel = ({ children, margin }) => {
  return <Label margin={margin}>{children}</Label>;
};

export default InputLabel;

const Label = styled.h5`
  font-size: 14px;
  margin: ${(props) => props.margin || "13px 0 7px 0"};
`;
