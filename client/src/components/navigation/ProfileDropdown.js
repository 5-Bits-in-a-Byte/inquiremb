import React, { useContext } from "react";
import styled from "styled-components";
import Arrow from "../../imgs/carrot-down-secondary.svg";
import Dropdown from "../common/dropdown/Dropdown";
import { UserContext } from "../context/UserProvider";

/** ProfileDropdown Component
 * @brief Dropdown container for link components for profile related tasks.
 * @returns ProfileDropdown component
 */
const ProfileDropdown = () => {
  const user = useContext(UserContext);

  /** @brief Wrapper for handling signout routing. */
  const handleSignOut = () => {
    const link = process.env.REACT_APP_SERVER_URL + "/logout";
    window.location.href = link;
  };

  const options = [
    {
      onClick: () => {
        alert("This feature is in progress.");
      },
      label: "User Profile",
    },
    { onClick: handleSignOut, label: "Sign Out" },
  ];

  return (
    <Wrapper>
      <Dropdown options={options}>
        <DropdownWrapper className="flex-row align">
          <Name className="font-regular">
            {user.first} {user.last}
          </Name>
          <Profile className="flex-row align justify" src={user.picture} />
          <ArrowImg src={Arrow} alt="Profile dropdown arrow" />
        </DropdownWrapper>
      </Dropdown>
    </Wrapper>
  );
};

export default ProfileDropdown;

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DropdownWrapper = styled.div`
  &:hover {
    .profile-arrow {
      opacity: 0.5;
    }
    .profile-circle {
      box-shadow: 0 0 3px #4a4a4a;
    }
  }
`;

const Profile = styled.img`
  border-radius: 100px;
  height: 38px;
  width: 38px;
  background: #e0e0e0;
`;

const ArrowImg = styled.img`
  height: 7px;
  margin-left: 7px;
`;

const Name = styled.h4`
  white-space: nowrap;
  margin-right: 10px;
`;
