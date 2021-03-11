import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import PinImg from "../../imgs/pin.svg";

export const CHECKED = 1;
export const UNCHECKED = 2;
export const INDETERMINATE = -1;

// const IndeterminateCheckbox = (props) => {
//   const { value, ...otherProps } = props;
//   return <input type="checkbox" {...otherProps} />;
// };

const Checkbox = ({ value, name, labelText, onChange }) => {
  // const checkRef = useRef();

  // useEffect(() => {
  //   checkRef.current.checked = value === CHECKED;
  //   checkRef.current.unchecked = value === UNCHECKED;
  //   console.log("Checked");
  // });

  // return (
  //   <input
  //     style={{ width: "1em", height: "1em", backgroundColor: "#121212" }}
  //     type="checkbox"
  //     ref={checkRef}
  //     {...otherProps}
  //   />
  // );

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
          <img src={PinImg} />
        </Box>
        <SpecialInput name={name} type="checkbox" onChange={onChange} />
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
  width: 14px;
  height: 14px;
  /* padding: 1em; */
  background-color: #dcdcdc;
`;

const CheckLabel = styled.label`
  line-height: 1em;
`;

const SpecialInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;
