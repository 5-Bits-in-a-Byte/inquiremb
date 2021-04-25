import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "../common/Button";
import ConfigPanelGroup from "./ConfigPanelGroup";
import RolePanel from "./roleConfigComponents/RolePanel";

const colorTest = [
  "#dd0000",
  "#dd7700",
  "#eedd00",
  "#00cc00",
  "#2a2aff",
  "#7337ee",
  "#ee55ee",
  "#00cccc",
  "#f76b60",
  "#8a5c07",
  "#c8d14d",
  "#4d8a0c",
  "#0c8a4b",
  "#27cdd6",
  "#454dba",
  "#3d1e85",
  "#710c7a",
  "#d7c3d9",
  "#c21d85",
  "#474747",
  "#edead5",
  "#d9edd5",
  "#a8e0dc",
  "#2b3659",
];

/**
 * Creates a json object of new role permissions
 * @param {number} itemId the new id to pupulate into the new role object
 * @returns JSON object modeling the Roles Model
 */
const createRoleObject = (itemId) => {
  let newPerms = {
    _id: itemId.toString(),
    roleName: "New Role " + itemId.toString(),
    roleColor: colorTest[Math.floor(Math.random() * colorTest.length)],
    publish: {
      postComment: false,
      reply: false,
      poll: false,
    },
    delete: {
      postComment: false,
      reply: false,
      poll: false,
    },
    participation: {
      reactions: false,
      voteInPoll: false,
      pin: false,
    },
    edit: {
      postComment: false,
      reply: false,
      poll: false,
    },
    privacy: {
      private: false,
      anonymous: false,
    },
    admin: {
      banUsers: false,
      removeUsers: false,
      announce: false,
      configure: false,
      highlightPost: false,
    },
  };

  return newPerms;
};

/**
 * Generates a list of Role Components for State Management
 */
const GenerateRoleList = (roles) => {
  return roles.map((role, index) => (
    <RolePanel
      key={index}
      value={index}
      roleObject={role}
      roleName={role?.roleName}
      panelOutlineColor={role?.roleColor}
    />
  ));
};

const ConfigPanel = ({
  courseRoles,
  setCourseRoles,
  roleIdCounter,
  setRoleIdCounter,
  ...props
}) => {
  let realRoleList = GenerateRoleList(courseRoles);

  console.log("RealRolesList: ", realRoleList);

  const [roleList, setRoleList] = useState(realRoleList);

  return (
    <PanelWrapper>
      <ConfigPanelGroup panelHeader={"List of Roles"}>
        {roleList}
        <Button
          secondary
          buttonWidth={"207px"}
          buttonHeight={"48px"}
          onClick={() => {
            setRoleIdCounter(roleIdCounter + 1);
            let newPerms = createRoleObject(roleIdCounter);

            // console.log("NEW PERMS: ", newPerms);

            let newCourseRoles = [...courseRoles, newPerms];
            setRoleList(GenerateRoleList(newCourseRoles));

            setCourseRoles(newCourseRoles);
          }}
        >
          + Add a New Role
        </Button>
      </ConfigPanelGroup>
      <ConfigPanelGroup panelHeader={"Assigned Roles"}></ConfigPanelGroup>

      <ButtonContainer>
        <Button
          style={{ margin: `0 0.5em`, color: `#4A86FA`, fontWeight: `600` }}
          outlineSecondary
          buttonWidth={"200px"}
          buttonHeight={"2.2rem"}
          onClick={() => {
            alert("Feature is work in progress.");
          }}
        >
          Cancel
        </Button>
        <Button
          primary
          style={{ margin: `0 0.5em` }}
          buttonWidth={"200px"}
          buttonHeight={"2.2rem"}
          onClick={() => {
            alert("Feature is work in progress.");
            // alert("Role Name: ", roleList[0].props.roleObject.roleName);
            for (let i = 0; i < roleList.length; i++) {
              console.log(
                roleList[i].props.roleObject?.roleName + " ",
                roleList[i].props.roleObject
              );
            }
          }}
        >
          Confirm
        </Button>
      </ButtonContainer>
    </PanelWrapper>
  );
};

export default ConfigPanel;

const PanelWrapper = styled.div`
  max-width: 1200px;
  padding: 2rem;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  width: 100%;
  padding: 0.5rem;

  /* border: 1px solid black; */
`;
