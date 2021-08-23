import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import MenuItem from "./MenuItem";
// Menu item images:
import ClockImg from "../../imgs/clock.svg";
import HomeImg from "../../imgs/home-white.svg";
import CourseImg from "../../imgs/courses-white.svg";
import MessagesImg from "../../imgs/messages-white.svg";
import InquireTooltip from "../common/InquireTooltip";

/** LeftNavBar Component
 * @brief Wrapper containing MenuItems routing the user to the main website pages
 * @returns LeftNavBar component
 */
const LeftNavBar = () => {
  const location = useLocation();
  const active = location.pathname;
  return (
    <Nav>
      <Wrapper>
        <InquireTooltip
          tooltipText={"See recent post history."}
          // hoverDelay={150}
          customPosition={{
            top: `25%`,
            right: `auto`,
            bottom: `auto`,
            left: `100%`,
          }}
        >
          <MenuItem
            to="/home"
            label="Recents"
            img={ClockImg}
            active={active === "/home"}
          />
        </InquireTooltip>
        <InquireTooltip
          tooltipText={"See your active classes."}
          // hoverDelay={150}
          customPosition={{
            top: `25%`,
            right: `auto`,
            bottom: `auto`,
            left: `100%`,
          }}
        >
          <MenuItem
            to="/"
            label="Courses"
            img={CourseImg}
            active={active === "/"}
          />
        </InquireTooltip>
      </Wrapper>
    </Nav>
  );
};

export default LeftNavBar;

const Nav = styled.nav`
  height: 100vh;
  width: 80px;
  background-color: #162b55;
  position: fixed;
  left: 0;
  top: 0;

  z-index: 9998;
`;

const Wrapper = styled.ul`
  margin-top: 66px; // 66px is the height of topNavBar
  /* padding: 0.5em; */

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* border: 1px solid red; */
`;
