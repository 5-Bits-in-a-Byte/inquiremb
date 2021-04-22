import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "../common/Button";
import ConfigPanelGroup from "./ConfigPanelGroup";
import RolePanel from "./roleConfigComponents/RolePanel";

const TestCourseRoleList = [
  <RolePanel key={"0"} roleName={"Student"}></RolePanel>,
  <RolePanel key={"1"} roleName={"TA 0"}></RolePanel>,
];

const CreateRolePanel = (name) => {
  return <RolePanel roleName={name} />;
};

const ConfigPanel = ({ props }) => {
  const [roleList, setRoleList] = useState(TestCourseRoleList);

  // const UpdateRoleList = (roles) => {
  //   let rolesCopy = roles;
  //   rolesCopy.push(CreateRolePanel("Test Role"));

  //   console.log("Roles Copy: ", rolesCopy);
  //   console.log("Role list after: ", roleList);
  //   return rolesCopy;
  // };

  return (
    <PanelWrapper>
      <ConfigPanelGroup panelHeader={"List of Roles"}>
        {roleList}
        <Button
          secondary
          buttonWidth={"207px"}
          buttonHeight={"48px"}
          onClick={() => {
            setRoleList(
              [...roleList, CreateRolePanel("Test Role")]
              // UpdateRoleList(roleList)
            );
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
