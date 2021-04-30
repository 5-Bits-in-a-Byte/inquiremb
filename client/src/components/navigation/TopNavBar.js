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
      <Wrapper>
        <Link to={"/"}>
          <LogoImg src={Logo} />
        </Link>
      </Wrapper>
      <Wrapper style={{ display: "flex", justifyContent: "center" }}>
        {courseId ? (
          <SearchBar placeholder="Search for a post or class" />
        ) : (
          <Dropdown options={options}>
            <DropdownSelector tabIndex="0">
              <SelectionName className={"noselect"}>
                Select a Class
              </SelectionName>
              <Icon
                className={"noselect"}
                src={Arrow}
                style={{ padding: "0 .75em 0 .25em" }}
              />
            </DropdownSelector>
          </Dropdown>
        )}
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

const DropdownSelector = styled.div`
  background-color: #e7e7e7;
  width: 100vw;
  height: 5vh;
  display: flex;
  align-items: center;
  border-radius: 0.25em;
  max-width: 360px;
  cursor: pointer;
  &:focus {
    outline-color: #162b55;
  }
`;

const SelectionName = styled.p`
  flex: 1;
  text-align: center;
`;
