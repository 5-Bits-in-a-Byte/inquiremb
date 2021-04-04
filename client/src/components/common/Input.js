import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

/** Input Component
 * Common component acting as a textfield styled to fit sitewide conventions.
 *
 * @param {string} types String representing the input type. ('password', 'submit', etc) Default: 'text'
 * @param {string} placeholder placeholder text.
 * @param {function} onChange event handler called when the input field has changes.
 * @param {object} props the rest of the component properties.
 * @returns Textfield styled to fit sitewide conventions.
 */
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
