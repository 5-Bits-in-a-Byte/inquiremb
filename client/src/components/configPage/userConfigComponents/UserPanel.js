import React, { useState } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import Button from "../../common/Button";
import Dropdown from "../../common/dropdown/Dropdown";
import Arrow from "../../../imgs/carrot-down-secondary.svg";
import { UserContext } from "../../context/UserProvider";

// Hardcoded dummy values
// Ultimately the goal is to pull these from the permissions object in the user context
const UserPerms = { canBan: true, canRemove: true };
//const dummy_all_roles = ["Administrator", "Student", "Assistant"];

/* Handle Role selection in the dropdown */
const GenerateRoleOptions = (roles) => {
  return roles.map((role) => ({
    onClick: () => {
      alert(role.roleName + " Role selected");
    },
    label: role.roleName,
  }));
};

const UserPanel = ({ userName, userRole, userImg, allRoles, ...props }) => {
  //const user = useContext(UserContext);

  let roleOptionsState = GenerateRoleOptions(allRoles);

  //console.log("Role state: ", roleOptionsState);

  const [roleOptions, setRoleOptions] = useState(roleOptionsState);
  //const [cachedRoleList, setCachedRoleList] = useState(roleList);

  // This will need to generate options using the allRoles prop
  //const options = generateRoleOptions(allRoles);

  return (
    <UserPanelWrapper>
      <UserIcon src={userImg} />
      <UserNameWrapper>
        <UserName>{userName}</UserName>
      </UserNameWrapper>
      <UserRoleWrapper borderColor={userRole.roleColor}>
        <Dropdown options={roleOptions}>
          <DropdownWrapper className="flex-row align">
            <RoleDisplay
              className="font-regular"
              /*textColor={userRole.roleColor}*/
            >
              {userRole.roleName}
            </RoleDisplay>
            <ArrowImg src={Arrow} alt="Profile dropdown arrow" />
          </DropdownWrapper>
        </Dropdown>
      </UserRoleWrapper>

      <AdminActionsWrapper>
        {UserPerms.canBan && (
          <Button
            style={{ margin: `0 0.5em`, color: `#DC2B2B`, fontWeight: `600` }}
            outlineSecondary
            buttonColor={"#DC2B2B"}
            buttonWidth={"125px"}
            buttonHeight={"2rem"}
            onClick={() => {
              alert("Feature is work in progress.");
            }}
          >
            Ban User
          </Button>
        )}
        {UserPerms.canRemove && (
          <Button
            primary
            buttonColor={"#DC2B2B"}
            buttonWidth={"125px"}
            buttonHeight={"2rem"}
            onClick={() => {
              alert("Feature is work in progress.");
            }}
          >
            Remove User
          </Button>
        )}
      </AdminActionsWrapper>
    </UserPanelWrapper>
  );
};

UserPanel.propTypes = {
  userObject: PropTypes.object,
  userName: PropTypes.string,
};

export default UserPanel;

const UserPanelWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 0.75rem 0;
  padding: 0.5rem 0.25rem 0.5rem 1rem;
  border: 2px solid #e7e7e7;
  border-radius: 5px;
  // Allow a little space between the scroll bar and the panel border
  width: 99%;
`;

const UserIcon = styled.img`
  float: left;
  width: 48px;
  height: 48px;
  margin-right: 0.5em;
  //margin-left: 0.5em;
  border-radius: 50%;
  user-select: none;
`;

const UserNameWrapper = styled.div`
  display: flex;
  align-items: left;
  margin: 1rem;
  width: 150px;
`;

const UserRoleWrapper = styled.div`
  display: flex;
  align-items: left;
  margin: 1rem;
  border: 2px solid ${(props) => props.borderColor || "#e7e7e7"};
  padding: 0.25rem 0.5rem 0.25rem 0.5rem;
  border-radius: 5px;
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

const RoleDisplay = styled.h4`
  white-space: nowrap;
  color: ${(props) => props.textColor || "#000000"};
`;

const ArrowImg = styled.img`
  height: 7px;
  margin-left: 7px;
`;

const AdminActionsWrapper = styled.div`
  display: flex;
  align-items: left;
  justify-content: space-evenly;
  margin: 1rem 0.25rem;
  margin-left: auto;
  width: 275px;
`;

const UserName = styled.p`
  font-size: 16px;
  font-weight: 700;
`;