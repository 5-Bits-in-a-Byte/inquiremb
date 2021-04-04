import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Checkmark from "./Checkmark";

const Checkbox = ({ checkboxName, labelText, onChange, checkStatus }) => {
  return (
    <Wrapper>
      <CheckLabel>
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
