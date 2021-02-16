import React from "react";
import styled from "styled-components";

const TopNavBar = () => {
  return <Nav></Nav>;
};

export default TopNavBar;

const Nav = styled.nav`
  width: 100vw;
  height: 55px;
  background-color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);
`;
