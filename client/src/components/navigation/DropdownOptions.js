import React from "react";
import styled, { css } from "styled-components";

const DropdownOptions = () => {
  return (
    <Options>
      <Option href={process.env.REACT_APP_SERVER_URL + "/logout"}>
        Sign Out
      </Option>
    </Options>
  );
};

export default DropdownOptions;

const Options = styled.div`
  position: absolute;
  overflow: hidden;
  top: 115%;
  right: 0;
  min-width: 100%;
  z-index: 10;
  display: block;
  background: white;
  border-radius: 4px;
  padding: 5px 0;
  height: auto;
  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.32);
`;

const Option = styled.a`
  cursor: pointer;
  display: block;
  padding: 5px 13px;
  min-width: 100%;
  white-space: nowrap;
  width: 100%;
  &:hover {
    background: #f0f0f0;
  }
  text-decoration: none;
`;
