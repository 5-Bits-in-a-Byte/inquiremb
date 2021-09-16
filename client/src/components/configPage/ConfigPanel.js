import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "../common/Button";
import ConfigPanelGroup from "./ConfigPanelGroup";
import RolePanel from "./roleConfigComponents/RolePanel";
import UserPanel from "./userConfigComponents/UserPanel";
import LazyFetch from "../common/requests/LazyFetch";
import LoadingDots from "../common/animation/LoadingDots";
import { UserRoleContext } from "../context/UserRoleProvider";
import Errors from "../common/Errors";
import { FormHelperText } from "@material-ui/core";

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
        question: false,
        announcement: false,
        poll: false,
        general: false,
        comment: false,
        reply: false,
      },
      delete: {
        question: false,
        announcement: false,
        poll: false,
        general: false,
        comment: false,
        reply: false,
      },
      participation: {
        reactions: false,
        voteInPoll: false,
        pin: false,
      },
      edit: {
        question: false,
        announcement: false,
        poll: false,
        general: false,
        comment: false,
        reply: false,
      },
      privacy: {
        private: false,
        anonymous: false,
      },
      admin: {
        banUsers: false,
        removeUsers: false,
        deleteOther: false,
        configure: false,
        highlightName: false,
      },
    },
  };

  return newPerms;
};

/**
 * Generates a list of Role Components for State Management
 */
const GenerateRoleList = (
  roles,
  setRoles,
  userList,
  setUserList,
  setConfigErrors
) => {
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
      setConfigErrors={setConfigErrors}
    />
  ));
};

/**
 * Generates a list of User Components for State Management
 */
const GenerateUserList = (
  users,
  roles,
  displayDropdown,
  displayBan,
  displayRemove,
  setAssignErrors
) => {
  var userRole = { name: "null", roleColor: "#e7e7e7" };

  return users.map((user, index) => {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i]._id == user.role) userRole = roles[i];
    }

    return (
      <UserPanel
        key={index}
        userId={user.userId}
        userName={user.userName}
        userImg={user.userImg}
        userRole={userRole}
        allRoles={roles}
        unbanList={false}
        displayDropdown={displayDropdown}
        displayBan={displayBan}
        displayRemove={displayRemove}
        setAssignErrors={setAssignErrors}
      />
    );
  });
};

const GenerateBannedUserList = (blacklist, displayBan, setAssignErrors) => {
  if (!blacklist) {
    return <></>;
  }
  return blacklist.map((bannedUser, index) => {
    return (
      <UserPanel
        key={index}
        userId={bannedUser.userId}
        userName={bannedUser.userName}
        userImg={bannedUser.userImg}
        unbanList={true}
        displayBan={displayBan}
        setAssignErrors={setAssignErrors}
      />
    );
  });
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
  const userRole = useContext(UserRoleContext);
  const [loadingIcons, setLoadingIcons] = useState(true);

  const [bannedUserList, setBannedUserList] = useState(null);
  // const [numBannedUsers, changeNumBanned] = useState(0);
  const [displayBanned, setDisplayBanned] = useState(false);
  const [configErrors, setConfigErrors] = useState(null);
  const [assignErrors, setAssignErrors] = useState(null);
  const [bannedErrors, setBannedErrors] = useState(null);

  // Grab the banned users
  useEffect(() => {
    if (!bannedUserList) {
      LazyFetch({
        type: "get",
        endpoint: "/courses/" + courseId + "/ban-remove",
        onSuccess: (data) => {
          if (data.success.length > 0) {
            setDisplayBanned(true);
            // changeNumBanned(data.success.length);
          }
          setBannedUserList(
            GenerateBannedUserList(
              data.success,
              userRole.admin.banUsers,
              setAssignErrors
            )
          );
        },
        onFailure: () => {
          setBannedErrors(
            "There was a problem getting the blacklist info for the course with id " +
              courseId
          );
        },
      });
    }
  }, []);

  let realUserList = GenerateUserList(
    courseUsers,
    courseRoles,
    userRole.admin.configure,
    userRole.admin.banUsers,
    userRole.admin.removeUsers,
    setAssignErrors
  );
  const [userList, setUserList] = useState(realUserList);

  // State for roles ------------------------------------------------------
  let realRoleList =
    courseRoles != null ? (
      GenerateRoleList(
        courseRoles,
        setCourseRoles,
        userList,
        setUserList,
        setConfigErrors
      )
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
      {userRole.admin.configure && (
        <ConfigPanelGroup
          panelHeader={"Edit the permissions of each role here."}
        >
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
                endpoint: "/courses/" + courseId + "/roles",
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

                  setUserList(
                    GenerateUserList(
                      courseUsers,
                      newCourseRoles,
                      userRole.admin.configure,
                      userRole.admin.banUsers,
                      userRole.admin.removeUsers,
                      setAssignErrors
                    )
                  );
                  setConfigErrors(null);
                },
                onFailure: (err) => {
                  setConfigErrors(err.response.data.errors);
                },
              });
            }}
          >
            + Add a New Role
          </Button>
          <Errors errors={configErrors} />
        </ConfigPanelGroup>
      )}
      {userRole.admin.configure && (
        <ButtonContainer>
          <Button
            primary
            style={{ margin: `0 0.5em` }}
            buttonWidth={"200px"}
            buttonHeight={"2.2rem"}
            onClick={() => {
              let testList = [];

              for (let i = 0; i < realRoleList.length; i++) {
                // console.log(realRoleList[i].props.roleObject);
                testList.push(realRoleList[i].props.roleObject);
              }

              // alert("Feature is work in progress.");
              LazyFetch({
                type: "put",
                endpoint: "/courses/" + courseId + "/roles",
                data: {
                  roles: testList,
                },
                onSuccess: (data) => {
                  console.log("Success PUT Roles: ", data);
                  alert("Changes saved successfully.");
                  setConfigErrors(null);
                },
                onFailure: (err) => {
                  console.log("Failed PUT Roles. ", err?.response);
                  if (err.response.data.errors)
                    setConfigErrors(err.response.data.errors);
                  else if (err.response.data.message)
                    setConfigErrors([err.response.data.message]);
                  else
                    setConfigErrors([
                      "Unspecified error occurred. Please try again.",
                    ]);
                },
              });
            }}
          >
            Confirm
          </Button>
        </ButtonContainer>
      )}

      <ConfigPanelGroup
        panelHeader={"Assign roles to participants of this course here."}
      >
        <UserContainer>{userList}</UserContainer>
        <Errors errors={assignErrors} />
      </ConfigPanelGroup>
      {displayBanned ? (
        <ConfigPanelGroup panelHeader={"Banned users."}>
          <UserContainer>{bannedUserList}</UserContainer>
          <Errors errors={bannedErrors} />
        </ConfigPanelGroup>
      ) : (
        <></>
      )}
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
  width: 100%;
  min-height: 150px;
  max-height: 300px;
  margin: 1rem 0;
  overflow: auto;
`;
