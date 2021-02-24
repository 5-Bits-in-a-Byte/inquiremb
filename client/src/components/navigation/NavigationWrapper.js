import React from "react";
import styled from "styled-components";
import LeftNavBar from "./LeftNavBar";
import TopNavBar from "./TopNavBar";

const MenuMargin = ({ children }) => {
  return (
    <>
      <LeftNavBar />
      <TopNavBar />
      <Wrapper>{children}</Wrapper>
    </>
  );
};

export default MenuMargin;

const Wrapper = styled.div`
  margin-top: 66px;
  margin-left: 80px;
  position: relative;
`;
