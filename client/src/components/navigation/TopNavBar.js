import React from "react";
import styled from "styled-components";
import Logo from "../../imgs/swag-logo.png";

const TopNavBar = () => {
  return (
    <Nav>
      <LogoImg src={Logo} />
    </Nav>
  );
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
  display: flex;
  align-items: center;
`;

const LogoImg = styled.img`
  height: 33px;
  margin-left: 10px;
`;
