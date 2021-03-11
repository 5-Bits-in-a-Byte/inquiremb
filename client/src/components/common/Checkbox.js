import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import PinImg from "../../imgs/pin.svg";
import BlueCheckmark from "../../imgs/bluecheck.svg";
import GreyCheckmark from "../../imgs/greycheck.svg";

export const CHECKED = 1;
export const UNCHECKED = 2;
export const INDETERMINATE = -1;

// const IndeterminateCheckbox = (props) => {
//   const { value, ...otherProps } = props;
//   return <input type="checkbox" {...otherProps} />;
// };

const Checkbox = ({ checkboxName, labelText, onChange, draft }) => {
  const handleCheckboxChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    const name = target.name;

    console.log(value);
  };

  return (
    <Wrapper>
      <CheckLabel>
        <Box>
          <CheckMark
            className="checkMark"
            id="Checkmark"
            src={draft[checkboxName] == true ? BlueCheckmark : GreyCheckmark}
          />
        </Box>
        <SpecialInput
          name={checkboxName}
          type="checkbox"
          onChange={onChange}
          onClick={(props) => {
            console.log(props.checked);
          }}
        />
        {labelText}
      </CheckLabel>
    </Wrapper>
  );
};

Checkbox.propTypes = {};

export default Checkbox;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  margin: 0 1em;

  background-color: #f1f1f1;
  /* border: 2px solid red; */
  border-radius: 4px;
`;

const Box = styled.div`
  float: left;
  width: 18px;
  height: 18px;
  margin: 0 0.5em;
`;

const CheckMark = styled.img`
  width: 18px;
  height: 18px;

  transition: 150ms ease-in-out;
`;

const CheckLabel = styled.label`
  margin: 0 0.5em;
  line-height: 1em;
  user-select: none;
  cursor: pointer;
  color: #162b55;
`;

const SpecialInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;

  border: 1px solid black;
`;
