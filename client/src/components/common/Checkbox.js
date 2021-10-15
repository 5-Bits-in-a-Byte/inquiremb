import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Checkmark from "./Checkmark";
import { ColorContext } from "../context/ColorModeContext";

/** Checkbox Component
 * A simple generic checkbox component to be used project wide where necessary.
 *
 * @param {string} checkboxName the name for this checkbox.
 * @param {string} labelText the text displayed with the checkbox.
 * @param {function} onChange the event handler for state change of the checkbox.
 * @param {bool} checkStatus holds the check status of the box.
 * @returns A simple checkbox component.
 */
const Checkbox = ({ checkboxName, labelText, onChange, checkStatus }) => {
  const theme = useContext(ColorContext);
  return (
    <Wrapper theme={theme}>
      <CheckLabel theme={theme}>
        <Checkmark
          checkSize={"18px"}
          checkFloat={"left"}
          checkStatus={checkStatus}
        />
        <SpecialInput
          name={checkboxName}
          type="checkbox"
          onChange={onChange}
          // onClick was used here for debug purposes
          // onClick={(props) => {
          //   console.log(props.checked || checkStatus);
          // }}
        />

        {labelText}
      </CheckLabel>
    </Wrapper>
  );
};

Checkbox.propTypes = {
  checkboxName: PropTypes.string,
  labelText: PropTypes.string,
  onChange: PropTypes.func,
  checkStatus: PropTypes.bool,
};

export default Checkbox;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  margin: 0 1em;
  padding: 0.6em 0px;

  background-color: ${(props) => props.theme.checkbox};
  /* border: 2px solid red; */
  border-radius: 4px;
`;

const CheckLabel = styled.label`
  margin: 0 0.5em;
  line-height: 1em;
  user-select: none;
  cursor: pointer;
  color: ${(props) => props.theme.logoFontColor};
`;

const SpecialInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;

  border: 1px solid black;
`;
