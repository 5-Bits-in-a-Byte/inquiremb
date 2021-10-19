import React, { useContext } from "react";
import styled from "styled-components";
import { ColorContext } from "../../context/ColorModeContext";
import "../css/noTextSelection.css";

/** DropdownOption Component
 * A simple contained clickable label acting an an option in a dropdown list of items.
 *
 * @param {object} props holds all of the props passed into this component.
 * @returns An object representing an option of a simple dropdown menu.
 */
const DropdownOption = ({ extra, ...props }) => {
  const theme = useContext(ColorContext);
  return (
    <Option className={"noselect"} {...props} theme={theme}>
      <Label className={"noselect"} theme={theme}>
        {props.children}
      </Label>
      {extra}
    </Option>
  );
};

export default DropdownOption;

const Option = styled.div`
  cursor: pointer;
  padding: 5px;
  min-width: 100%;
  white-space: nowrap;
  width: 100%;
  &:hover {
    background: ${(props) => props.theme.dropDownHover};
  }
`;

const Label = styled.a`
  font-size: 14px;
  color: ${(props) => props.theme.dropDownText};
  margin-left: 10px;
  margin-right: 10px;
`;
