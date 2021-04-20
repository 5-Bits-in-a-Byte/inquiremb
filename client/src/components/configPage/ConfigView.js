import React from "react";
import styled, { css } from "styled-components";

const ConfigView = ({ props }) => {
  return (
    <ConfigWrapper>
      <ScrollingDiv>
        <h1>THIS IS THE CONFIG PAGE</h1>

        {/* KEEP THE OVERFLOW COUNTER IT HELPS WITH OVERFLOW
            at the bottom of the scrolling div. */}
        <OverflowCounter offsetAmount={"30px"}></OverflowCounter>
      </ScrollingDiv>
    </ConfigWrapper>
  );
};

export default ConfigView;

const ConfigWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
`;

const ScrollingDiv = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  padding: 2rem 4rem 0 4rem;

  overflow: auto;
`;

/** THIS ACCOUNTS FOR WEIRD SCROLLING DIV STUFF */
const OverflowCounter = styled.div`
  width: 100%;
  ${(props) =>
    props.offsetAmount &&
    css`
      padding: ${props.offsetAmount};
    `}
`;
