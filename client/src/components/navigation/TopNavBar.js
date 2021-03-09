import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Logo from "../../imgs/inquire-logo.png";
import SearchBar from "../common/SearchBar";
import ProfileDropdown from "./ProfileDropdown";

const TopNavBar = () => {
  return (
    <Nav>
      <Wrapper>
        <Link to={"/"}>
          <LogoImg src={Logo} />
        </Link>
      </Wrapper>
      <Wrapper>
        <SearchBar placeholder="Search for a post or class" />
      </Wrapper>
      <Wrapper>
        <ProfileDropdown />
      </Wrapper>
    </Nav>
  );
};

export default TopNavBar;

const Wrapper = styled.div`
  flex: 1;
`;

const Nav = styled.nav`
  width: 100vw;
  height: 66px;
  background-color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 9999;
`;

const LogoImg = styled.img`
  height: 40px;
`;
