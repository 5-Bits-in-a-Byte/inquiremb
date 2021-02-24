import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

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

Input.propTypes = {
  /* Text handler for onChange event */
  onChange: PropTypes.func,
  /* Placeholder text for the input */
  placeholder: PropTypes.string,
  /* 
  The type of input expected: ie, password, submit, etc.
  Defaults to 'text'
  */
  type: PropTypes.string,
};

export default Input;

const StyledInput = styled.input`
  border: 1px solid #818181;
  background-color: #fff;
  border-radius: 4px;
  font-size: 16px;
  padding: 7px 9px;
  width: 100%;
`;
