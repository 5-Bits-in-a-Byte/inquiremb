import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import styled, { css } from "styled-components";
import ClockImg from "../../imgs/clock.svg";
import CourseImg from "../../imgs/courses-white.svg";
import { useOnClickAway } from "../common/CustomHooks";
import MenuItem from "./MenuItem";

const MobileLeftNavBar = ({ openState, debug, chidren, ...props }) => {
  const location = useLocation();
  const active = location.pathname;

  // const node = useOnClickAway(() => openState.setState(false));

  return (
    <>
      <Wrapper debug={debug} openState={openState.state} /* ref={node} */>
        <NavWrapper debug={debug}>
          <MenuItem
            to="/home"
            label="Recents"
            img={ClockImg}
            active={active === "/home"}
            onClick={(event) => {
              console.log("MenuItem Click: ", openState.state);
              openState.setState(false);
              console.log(event);
            }}
          />
          <MenuItem
            to="/"
            label="Courses"
            img={CourseImg}
            active={active === "/"}
            onClick={(event) => {
              console.log("MenuItem Click: ", openState.state);
              openState.setState(false);
              console.log(event);
            }}
          />
        </NavWrapper>
      </Wrapper>
    </>
  );
};

export default MobileLeftNavBar;

const Wrapper = styled.div`
  ${({ openState }) =>
    openState
      ? css`
          width: 80px;
          visibility: visible;
        `
      : css`
          width: 0;
          visibility: hidden;
        `};

  height: 100vh;
  padding-top: calc(66px + 58px);
  position: fixed;
  left: 0;
  top: 0;

  overflow: hidden;

  background-color: #162b55;
  box-shadow: 10px 0px 10px rgba(0, 0, 0, 0.25);

  z-index: 9997;

  transition: 150ms ease-out;

  ${({ debug }) =>
    debug
      ? css`
          border: 1px solid red;
        `
      : ""};
`;

const NavWrapper = styled.nav`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 1em;

  display: flex;
  flex-direction: column;
  align-items: center;

  /* div {
    width: 42px;
    height: 42px;
    margin-bottom: 1em;

    background-color: black;

    border-radius: 4px;
  } */
`;
