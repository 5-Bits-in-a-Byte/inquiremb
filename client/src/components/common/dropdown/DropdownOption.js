import React from "react";
import styled from "styled-components";

const DropdownOption = (props) => {
  return (
    <Option {...props}>
      <Label>{props.children}</Label>
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
