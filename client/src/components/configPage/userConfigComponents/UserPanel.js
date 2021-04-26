import React, { useState } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import Button from "../../common/Button";
import Dropdown from "../../common/dropdown/Dropdown";
import TempIcon from "../../../imgs/temporary-user-icon.png";

const UserPerms = { canBan: true, canRemove: true };

const UserPanel = ({ userName, userRole, ...props }) => {
  // --------------------------------------------

  return (
    <UserPanelWrapper>
      <UserIcon src={TempIcon} />
      <UserNameWrapper>
        <UserName>{userName}</UserName>
      </UserNameWrapper>
      <UserRoleWrapper>{userRole}</UserRoleWrapper>

      <AdminActionsWrapper>
        {UserPerms.canBan && (
          <Button
            primary
            buttonColor={"#DC7B00"}
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
  width: 35%;
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
