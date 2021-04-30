import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "../common/Button";
import ConfigPanelGroup from "./ConfigPanelGroup";
import RolePanel from "./roleConfigComponents/RolePanel";
import UserPanel from "./userConfigComponents/UserPanel";
import LazyFetch from "../common/requests/LazyFetch";
import LoadingDots from "../common/animation/LoadingDots";

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
    // _id: itemId.toString(),
    name: "New Role " + itemId.toString(),
    // roleColor: colorTest[Math.floor(Math.random() * colorTest.length)],
    permissions: {
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
    },
  };

  return newPerms;
};

/**
 * Generates a list of Role Components for State Management
 */
const GenerateRoleList = (roles, setRoles, userList, setUserList) => {
  return roles.map((role, index) => (
    <RolePanel
      key={index}
      value={index}
      roleObject={role}
      roleName={role?.name}
      panelOutlineColor={role?.roleColor}
      courseRoles={roles}
      setCourseRoles={setRoles}
      userList={userList}
      setUserList={setUserList}
    />
  ));
};

/**
 * Generates a list of User Components for State Management
 */
const GenerateUserList = (users, roles) => {
  var test_simple_role = { roleName: "Regular User", roleColor: "#55cc88" };

  // if (roles[users.])

  return users.map((user, index) => (
    <UserPanel
      key={index}
      userName={user.userName}
      userImg={user.userImg}
      userRole={test_simple_role}
      allRoles={roles}
    />
  ));
};

const ConfigPanel = ({
  courseId,
  courseUsers,
  courseRoles,
  setCourseRoles,
  roleIdCounter,
  setRoleIdCounter,
  ...props
}) => {
  const [loadingIcons, setLoadingIcons] = useState(true);

  // State for users
  let realUserList = GenerateUserList(courseUsers, courseRoles);

  const [userList, setUserList] = useState(realUserList);
  //const [cachedUserList, setCachedUserList] = useState(userList);

  // State for roles ------------------------------------------------------
  let realRoleList =
    courseRoles != null ? (
      GenerateRoleList(courseRoles, setCourseRoles, userList, setUserList)
    ) : (
      <></>
    );
  // ----------------------------------------------------------------------

  useEffect(() => {
    setTimeout(() => {
      setLoadingIcons(false);
    }, 500);
  });

  return (
    <PanelWrapper>
      <ConfigPanelGroup panelHeader={"Edit the permissions of each role here."}>
        {loadingIcons ? (
          <div style={{ margin: `2em 0` }}>
            <LoadingDots size={24} color={"#4a86fa"} />
          </div>
        ) : (
          realRoleList
        )}
        <Button
          secondary
          buttonWidth={"207px"}
          buttonHeight={"48px"}
          onClick={() => {
            setRoleIdCounter(roleIdCounter + 1);
            let newPerms = createRoleObject(roleIdCounter);

            LazyFetch({
              type: "post",
              endpoint: "/api/courses/" + courseId + "/roles",
              data: {
                name: newPerms.name,
                permissions: newPerms.permissions,
              },
              onSuccess: (data) => {
                let { status, role } = data;
                console.log("Roles Post Success: ", status);
                let newCourseRoles =
                  courseRoles != null ? [...courseRoles, role] : [role];
                setCourseRoles(newCourseRoles);

                setUserList(GenerateUserList(courseUsers, newCourseRoles));
              },
              onFailure: (err) => {
                console.log("Failed to Post Roles.", err?.response);
              },
            });
          }}
        >
          + Add a New Role
        </Button>
      </ConfigPanelGroup>
      <ConfigPanelGroup
        panelHeader={"Assign roles to participants of this course here."}
      >
        <UserContainer>{userList}</UserContainer>
      </ConfigPanelGroup>

      <ButtonContainer>
        <Button
          primary
          style={{ margin: `0 0.5em` }}
          buttonWidth={"200px"}
          buttonHeight={"2.2rem"}
          onClick={() => {
            console.log("CourseRoles (Confirm): ", courseRoles);
            let testList = [];

            for (let i = 0; i < realRoleList.length; i++) {
              console.log(realRoleList[i].props.roleObject);
              testList.push(realRoleList[i].props.roleObject);
            }

            // alert("Feature is work in progress.");
            LazyFetch({
              type: "put",
              endpoint: "/api/courses/" + courseId + "/roles",
              data: {
                roles: testList,
              },
              onSuccess: (data) => {
                console.log("Success PUT Roles: ", data);
                alert("Changes saved successfully.");
              },
              onFailure: (err) => {
                console.log("Failed PUT Roles.", err);
                alert("Error: Changes not saved. Please try again.");
              },
            });
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
  /* margin-bottom: 10em; */
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

const UserContainer = styled.div`
  height: 300px;
  width: 100%;
  margin: 1rem 0;
  overflow: auto;
`;
