import React from "react";
import styled, { css } from "styled-components";

const SidebarSection = ({ debug, ...props }) => {
  return (
    <>
      <Wrapper debug></Wrapper>
    </>
  );
};

export default SidebarSection;

const Wrapper = styled.div`
  ${({ debug }) =>
    debug &&
    css`
      border: 1px solid blue;
    `};

  /* width: 100%; */
  height: 45px;
  margin: 1em;
`;
