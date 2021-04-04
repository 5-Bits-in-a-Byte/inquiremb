import React from "react";
import styled from "styled-components";
import BlueCheckmark from "../../imgs/bluecheck.svg";
import GreyCheckmark from "../../imgs/greycheck.svg";

const Checkmark = ({ checkSize, checkFloat, checkStatus }) => {
  return (
    <Box
      className="checkMark"
      id="Checkmark"
      size={checkSize}
      float={checkFloat}
    >
      <CheckImg
        src={checkStatus == true ? BlueCheckmark : GreyCheckmark}
        size={checkSize}
      />
    </Box>
  );
};

export default Checkmark;

// Defaults for the size and alignment
var defaultSize = "18px";
var defaultFloat = "none";

const Box = styled.div`
  float: ${(props) => props.float || defaultFloat};
  width: ${(props) => props.size || defaultSize};
  height: ${(props) => props.size || defaultSize};
  margin: 0 0.5em;
`;

const CheckImg = styled.img`
  width: ${(props) => props.size || defaultSize};
  height: ${(props) => props.size || defaultSize};

  transition: 150ms ease-in-out;
`;
