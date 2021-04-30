import React from "react";
import styled from "styled-components";
import "../css/noTextSelection.css";

/** DropdownOption Component
 * A simple contained clickable label acting an an option in a dropdown list of items.
 *
 * @param {object} props holds all of the props passed into this component.
 * @returns An object representing an option of a simple dropdown menu.
 */
const DropdownOption = ({ extra, ...props }) => {
  return (
    <Option className={"noselect"} {...props}>
      <Label className={"noselect"}>{props.children}</Label>
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
    background: #f0f0f0;
  }
`;

const Label = styled.a`
  font-size: 14px;
  color: #333333;
  margin-left: 10px;
  margin-right: 10px;
`;
