import React from "react";
import styled from "styled-components";

const Input = ({ type, placeholder, onChange, ...props }) => {
  return (
    <StyledInput
      type={type || "text"}
      placeholder={placeholder}
      onChange={onChange}
      {...props}
    />
  );
};

export default Input;

const StyledInput = styled.input`
  border: 1px solid #818181;
  background-color: #fff;
  border-radius: 4px;
  font-size: 14px;
  padding: 7px 9px;
  width: 100%;
`;
