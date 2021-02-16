import React from "react";
import styled from "styled-components";
import MenuItem from "./MenuItem";
// Menu item images:
import CourseImg from "../../imgs/courses-white.svg";

const LeftNavBar = () => {
  return (
    <Nav>
      <Wrapper>
        <MenuItem to="/" label="Courses" img={CourseImg} />
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
