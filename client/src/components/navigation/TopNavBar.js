import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useParams } from "react-router";
import styled, { withTheme } from "styled-components";
import Logo from "../../imgs/inquire-logo.png";
import SearchBar from "../common/SearchBar";
import ProfileDropdown from "./ProfileDropdown";
import Dropdown from "../common/dropdown/Dropdown";
import { UserContext } from "../context/UserProvider";
import Arrow from "../../imgs/carrot-down-secondary.svg";
import Icon from "../common/Icon";
import InquireLogoSVG from "../../imgs/inquire_logo_navbar.svg";
import "../common/css/noTextSelection.css";

/** TopNavBar Component
 * @brief Wrapper the top content of the website such as profile icon / menu, etc etc
 * @returns TopNavBar component
 */

const TopNavBar = () => {
  const { courseId } = useParams();
  const user = useContext(UserContext);
  const history = useHistory();

  const handleRouteChange = (cid) => {
    let path = "/course/" + cid;
    history.push(path);
  };

  // Create the options for the dropdown
  let options = [];
  for (let i = 0; i < user.courses.length; i++) {
    let option = {
      // Have to set click up this way so history.push isn't called on page load
      onClick: () => {
        handleRouteChange(user.courses[i].courseId);
      },
      label: user.courses[i].courseName,
      color: user.courses[i].color,
    };
    options.push(option);
  }

  return (
    <Nav>
      <FlexWrapper>
        <Link to={"/"} style={{ textDecoration: `none` }}>
          <InquireLogo>
            <LogoIMG src={InquireLogoSVG} />
            <LogoText>Inquire</LogoText>
          </InquireLogo>
          {/* <LogoImg src={Logo} /> */}
        </Link>
      </FlexWrapper>
      <FlexWrapper style={{ display: "flex", justifyContent: "center" }}>
        {false ? (
          <SearchBar placeholder="Search for a post or class" />
        ) : (
          <Dropdown options={options}>
            <DropdownSelector tabIndex="0">
              <SelectionName className={"noselect"}>
                Quick Navigate
              </SelectionName>
              <Icon
                className={"noselect"}
                src={Arrow}
                style={{ padding: "0 .75em 0 .25em" }}
              />
            </DropdownSelector>
          </Dropdown>
        )}
      </FlexWrapper>
      <FlexWrapper>
        <ProfileDropdown />
      </FlexWrapper>
    </Nav>
  );
};

export default TopNavBar;

const FlexWrapper = styled.div`
  flex: 1;
`;

const InquireLogo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LogoIMG = styled.img`
  width: 38px;
  height: auto;
  transition: 150ms ease-out;

  @media only screen and (min-width: 1201px) {
    width: 38px;
  }
  /* @media only screen and (max-width: 1200px) {
    width: 450px;
  }
  @media only screen and (max-width: 1024px) {
    width: 300px;
  } */
  @media only screen and (max-width: 768px) {
    width: 24px;
  }
  @media only screen and (max-width: 480px) {
    width: 20px;
  }
`;

const LogoText = styled.h2`
  margin-left: 0.5em;
  font-size: 32px;
  transition: 150ms ease-out;

  @import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
  font-family: "Poppins", sans-serif;

  @media only screen and (min-width: 1201px) {
    font-size: 32px;
  }
  /* @media only screen and (max-width: 1200px) {
    font-size: 450px;
  }
  @media only screen and (max-width: 1024px) {
    font-size: 300px;
  } */
  @media only screen and (max-width: 768px) {
    font-size: 24px;
  }
  @media only screen and (max-width: 480px) {
    font-size: 20px;
  }
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
  z-index: 9998;

  @media only screen and (max-width: 480px) {
    padding: 0 0.5em;
  }
`;

const LogoImg = styled.img`
  height: 40px;
`;

const DropdownSelector = styled.div`
  background-color: #e7e7e7;
  height: 2rem;
  display: flex;
  align-items: center;
  border-radius: 0.25em;
  max-width: 360px;
  cursor: pointer;
  &:focus {
    outline-color: #162b55;
  }

  transition: 150ms ease-out;

  @media only screen and (min-width: 1201px) {
    width: 100vw;
  }
  @media only screen and (max-width: 1200px) {
    width: 450px;
  }
  @media only screen and (max-width: 1024px) {
    width: 300px;
  }
  @media only screen and (max-width: 768px) {
    width: 200px;
  }
  @media only screen and (max-width: 480px) {
    width: 125px;
    font-size: 14px;
  }
`;

const SelectionName = styled.p`
  flex: 1;
  text-align: center;
`;
