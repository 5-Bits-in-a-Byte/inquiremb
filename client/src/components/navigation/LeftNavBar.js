import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import MenuItem from "./MenuItem";
// Menu item images:
import HomeImg from "../../imgs/home-white.svg";
import CourseImg from "../../imgs/courses-white.svg";
import MessagesImg from "../../imgs/messages-white.svg";

const LeftNavBar = () => {
  const location = useLocation();
  const active = location.pathname;
  return (
    <Nav>
      <Wrapper>
        <MenuItem
          to="/home"
          label="Home"
          img={HomeImg}
          active={active === "/home"}
        />
        <MenuItem
          to="/"
          label="Courses"
          img={CourseImg}
          active={active === "/"}
        />
        <MenuItem
          to="/messages"
          label="Messages"
          img={MessagesImg}
          active={active === "/messages"}
        />
      </Wrapper>
    </Nav>
  );
};

export default LeftNavBar;

const Nav = styled.nav`
  height: 100vh;
  width: 65px;
  background-color: #162b55;
  position: fixed;
  left: 0;
  top: 0;
`;

const Wrapper = styled.ul`
  margin-top: 55px;
  padding: 10px 0;
`;
