import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import MenuItem from "./MenuItem";
// Menu item images:
import ClockImg from "../../imgs/clock.svg";
import HomeImg from "../../imgs/home-white.svg";
import CourseImg from "../../imgs/courses-white.svg";
import MessagesImg from "../../imgs/messages-white.svg";
import InquireTooltip from "../common/InquireTooltip";
import { useWindowDimensions } from "../common/CustomHooks";
import MobileLeftNavBar from "./MobileLeftNavBar";

/** LeftNavBar Component
 * @brief Wrapper containing MenuItems routing the user to the main website pages
 * @returns LeftNavBar component
 */
const LeftNavBar = ({ props }) => {
  const [hidddenState, setHiddenState] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (width <= 768) {
      setHiddenState(true);
    } else {
      setHiddenState(false);
      setShowMobileNav(false);
    }
  }, [width]);

  const location = useLocation();
  const active = location.pathname;

  return (
    <>
      {hidddenState ? (
        <BurgerMenu
          id={"Burger-Menu"}
          onClick={(event) => {
            console.log("Burger Menu Click: ", showMobileNav);
            setShowMobileNav(!showMobileNav);
            event.stopPropagation();
          }}
        >
          <img
            src={"https://img.icons8.com/ios-glyphs/30/000000/menu--v1.png"}
            alt=""
          />
        </BurgerMenu>
      ) : (
        <></>
      )}
      {/* {hidddenState ? (
        <>{showMobileNav ? <MobileLeftNavBar openState={showMobileNav} /> : <></>}</>
      ) : (
        <>
          <Nav hide={hidddenState}>
            <Wrapper>
              <MenuItem
                to="/home"
                label="Recents"
                img={ClockImg}
                active={active === "/home"}
              />
              <MenuItem
                to="/"
                label="Courses"
                img={CourseImg}
                active={active === "/"}
              />
            </Wrapper>
          </Nav>
        </>
      )} */}
      <MobileLeftNavBar
        openState={{ state: showMobileNav, setState: setShowMobileNav }}
      />
      <Nav hide={hidddenState}>
        <Wrapper>
          <MenuItem
            to="/home"
            label="Recents"
            img={ClockImg}
            active={active === "/home"}
          />
          <MenuItem
            to="/"
            label="Courses"
            img={CourseImg}
            active={active === "/"}
          />
        </Wrapper>
      </Nav>
    </>
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
  overflow: hidden;

  transition: 150ms ease-out;

  /* @media only screen and (max-width: 1200px) {
  }
  @media only screen and (max-width: 1025px) {
  } */
  @media only screen and (max-width: 769px) {
    visibility: ${(props) => (props.hide ? "hidden" : "visible")};
    width: ${(props) => (props.hide ? 0 : "80px")};
  }
  /* @media only screen and (max-width: 481px) {
  }
  @media only screen and (max-width: 400px) {
  } */
`;

const Wrapper = styled.ul`
  margin-top: 66px; // 66px is the height of topNavBar
  /* padding: 0.5em; */

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  transition: 150ms ease-out;

  /* @media only screen and (max-width: 1200px) {
  }
  @media only screen and (max-width: 1025px) {
  }
  @media only screen and (max-width: 769px) {
  }
  @media only screen and (max-width: 481px) {
  }
  @media only screen and (max-width: 400px) {
  } */
`;

const BurgerMenu = styled.div`
  position: absolute;
  top: 66px;
  left: 0;

  width: 42px;
  height: 42px;
  margin-top: 1em;
  margin-left: 1.2em;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9998;

  box-shadow: 0px 0.25em 0.5em 0.125em rgba(0, 0, 0, 0.07);

  background-color: #f8f8f8;
  border-radius: 5px;
  /* border: 1px solid red; */

  transition: 150ms ease-out;

  :hover {
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.363);
  }

  :active {
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.363);
    border: 2px solid #d9d9d9;
  }
`;
