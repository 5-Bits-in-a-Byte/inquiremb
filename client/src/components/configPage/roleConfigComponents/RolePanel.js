import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import Button from "../../common/Button";
import PencilIcon from "../../../imgs/pencil.svg";
import CloseButtonIcon from "../../../imgs/close.svg";
import Input from "../../common/Input";
import DraftTextArea from "../../common/DraftTextArea";
import Dropdown from "../../common/dropdown/Dropdown";
import Arrow from "../../../imgs/carrot-down-secondary.svg";
import MaterialDropDownGroup from "./MaterialDropDownGroup";
import UserPanel from "../userConfigComponents/UserPanel";

// MATERIAL UI -----------------------------------------------------------
import { makeStyles, useTheme } from "@material-ui/core/styles";
import LazyFetch from "../../common/requests/LazyFetch";

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 100,
  },
}));
// -----------------------------------------------------------------------

/**
 * Generates a list of User Components for State Management
 */
const GenerateUserList = (users, roles) => {
  var test_simple_role = { roleName: "Regular User", roleColor: "#55cc88" };

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

const RolePanel = ({
  roleObject,
  roleName,
  panelOutlineColor,
  courseRoles,
  setCourseRoles,
  userList,
  setUserList,
  ...props
}) => {
  // MATERIAL UI --------------------------------
  const styleClasses = useStyles();

  const [publishAnchorEl, setPublishAnchorEl] = useState(null);

  // const publishHandleClick = (event) => {
  //   setPublishAnchorEl(event?.currentTarget);
  // };

  // const publishHandleClose = () => {
  //   setPublishAnchorEl(null);
  // };

  const [publishCheckedState, setPublishCheckedState] = useState({
    question: roleObject.permissions.publish.question,
    announcement: roleObject.permissions.publish.announcement,
    poll: roleObject.permissions.publish.poll,
    general: roleObject.permissions.publish.general,
    comment: roleObject.permissions.publish.comment,
    reply: roleObject.permissions.publish.reply,
  });

  // console.log("Publish init state: ", publishCheckedState);

  const [deleteCheckedState, setDeleteCheckedState] = useState({
    question: roleObject.permissions.delete.question,
    announcement: roleObject.permissions.delete.announcement,
    poll: roleObject.permissions.delete.poll,
    general: roleObject.permissions.delete.general,
    comment: roleObject.permissions.delete.comment,
    reply: roleObject.permissions.delete.reply,
  });

  const [editCheckedState, setEditCheckedState] = useState({
    question: roleObject.permissions.edit.question,
    announcement: roleObject.permissions.edit.announcement,
    poll: roleObject.permissions.edit.poll,
    general: roleObject.permissions.edit.general,
    comment: roleObject.permissions.edit.comment,
    reply: roleObject.permissions.edit.reply,
  });

  const [participationCheckedState, setParticipationCheckedState] = useState({
    reactions: roleObject.permissions.participation.reactions,
    voteInPoll: roleObject.permissions.participation.voteInPoll,
    pin: roleObject.permissions.participation.pin,
  });

  const [privacyCheckedState, setPrivacyCheckedState] = useState({
    private: roleObject.permissions.privacy.private,
    anonymous: roleObject.permissions.privacy.anonymous,
  });

  const [adminCheckedState, setAdminCheckedState] = useState({
    banUsers: roleObject.permissions.admin.banUsers,
    removeUsers: roleObject.permissions.admin.removeUsers,
    deleteOther: roleObject.permissions.admin.deleteOther,
    configure: roleObject.permissions.admin.configure,
    highlightName: roleObject.permissions.admin.highlightName,
  });
  // --------------------------------------------

  const urlParams = useParams();

  const [nameField, setNameField] = useState(roleName);
  const [nameFieldState, setNameFieldState] = useState(true);

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      if (!nameFieldState) {
        if (nameField.trim() == "") setNameField(roleName);
      }
      if (e.target.value != roleObject.name) {
        roleObject.name = e.target.value;
      }
      setNameField(e.target.value);
      setNameFieldState(true);
    }
  };

  // console.log("This role id: ", props.value);

  return (
    <RolePanelWrapper panelOutlineColor={panelOutlineColor}>
      <RoleNameWrapper>
        {nameFieldState ? (
          <RoleName style={{ margin: `0 1rem 0 0` }}>{nameField}</RoleName>
        ) : (
          <DraftTextArea
            minRows={1}
            style={{ width: `150px`, marginRight: `1em` }}
            onKeyDown={handleKeyDown}
          >
            {nameField}
          </DraftTextArea>
        )}

        <Button
          primary
          buttonColor={"rgba(0, 0, 0, 0.0)"}
          onClick={() => {
            if (nameFieldState) {
              if (nameField.trim() == "") setNameField(roleName);
            }
            setNameFieldState(!nameFieldState);
          }}
        >
          <ChangeNameIcon src={PencilIcon} />
        </Button>
      </RoleNameWrapper>

      {/* PUBLISH DROPDOWN */}
      <MaterialDropDownGroup
        initialState={publishCheckedState}
        roleObject={roleObject}
        matDropShape={{
          name: "Publish",
          items: [
            {
              stateLabel: "question",
              itemLabel: "Users in this role can publish Questions",
              changeRoleVal: (val) => {
                roleObject.permissions.publish.question = val;
                setPublishCheckedState({
                  ...publishCheckedState,
                  question: val,
                });
              },
            },
            {
              stateLabel: "announcement",
              itemLabel: "Users in this role can publish Announcements",
              changeRoleVal: (val) => {
                roleObject.permissions.publish.announcement = val;
                setPublishCheckedState({
                  ...publishCheckedState,
                  announcement: val,
                });
              },
            },
            {
              stateLabel: "poll",
              itemLabel: "Users in this role can publish Polls",
              changeRoleVal: (val) => {
                roleObject.permissions.publish.poll = val;
                setPublishCheckedState({
                  ...publishCheckedState,
                  poll: val,
                });
              },
            },
            {
              stateLabel: "general",
              itemLabel: "Users in this role can publish General Posts",
              changeRoleVal: (val) => {
                roleObject.permissions.publish.general = val;
                setPublishCheckedState({
                  ...publishCheckedState,
                  general: val,
                });
              },
            },
            {
              stateLabel: "comment",
              itemLabel: "Users in this role can publish comments on posts",
              changeRoleVal: (val) => {
                roleObject.permissions.publish.comment = val;
                setPublishCheckedState({
                  ...publishCheckedState,
                  comment: val,
                });
              },
            },
            {
              stateLabel: "reply",
              itemLabel: "Users in this role can reply to comments",
              changeRoleVal: (val) => {
                roleObject.permissions.publish.reply = val;
                setPublishCheckedState({
                  ...publishCheckedState,
                  reply: val,
                });
              },
            },
          ],
        }}
      ></MaterialDropDownGroup>

      {/* DELETE DROPDOWN */}
      <MaterialDropDownGroup
        initialState={deleteCheckedState}
        roleObject={roleObject}
        matDropShape={{
          name: "Delete",
          items: [
            {
              stateLabel: "question",
              itemLabel: "Users in this role can delete questions they made",
              changeRoleVal: (val) => {
                roleObject.permissions.delete.question = val;
                setDeleteCheckedState({
                  ...deleteCheckedState,
                  question: val,
                });
              },
            },
            {
              stateLabel: "announcement",
              itemLabel:
                "Users in this role can delete announcements they made",
              changeRoleVal: (val) => {
                roleObject.permissions.delete.announcement = val;
                setDeleteCheckedState({
                  ...deleteCheckedState,
                  announcement: val,
                });
              },
            },
            {
              stateLabel: "poll",
              itemLabel: "Users in this role can delete polls they made",
              changeRoleVal: (val) => {
                roleObject.permissions.delete.poll = val;
                setDeleteCheckedState({
                  ...deleteCheckedState,
                  poll: val,
                });
              },
            },
            {
              stateLabel: "general",
              itemLabel:
                "Users in this role can delete general posts they made",
              changeRoleVal: (val) => {
                roleObject.permissions.delete.general = val;
                setDeleteCheckedState({
                  ...deleteCheckedState,
                  general: val,
                });
              },
            },
            {
              stateLabel: "comment",
              itemLabel: "Users in this role can delete comments they made",
              changeRoleVal: (val) => {
                roleObject.permissions.delete.comment = val;
                setDeleteCheckedState({
                  ...deleteCheckedState,
                  comment: val,
                });
              },
            },
            {
              stateLabel: "reply",
              itemLabel: "Users in this role can delete replies they made",
              changeRoleVal: (val) => {
                roleObject.permissions.delete.reply = val;
                setDeleteCheckedState({
                  ...deleteCheckedState,
                  reply: val,
                });
              },
            },
          ],
        }}
      ></MaterialDropDownGroup>

      {/* EDIT DROPDOWN */}
      <MaterialDropDownGroup
        initialState={editCheckedState}
        roleObject={roleObject}
        matDropShape={{
          name: "Edit",
          items: [
            {
              stateLabel: "question",
              itemLabel: "Users in this role can edit questions that they made",
              changeRoleVal: (val) => {
                roleObject.permissions.edit.question = val;
                setEditCheckedState({
                  ...editCheckedState,
                  question: val,
                });
              },
            },
            {
              stateLabel: "announcement",
              itemLabel:
                "Users in this role can edit announcements that they made",
              changeRoleVal: (val) => {
                roleObject.permissions.edit.announcement = val;
                setEditCheckedState({
                  ...editCheckedState,
                  announcement: val,
                });
              },
            },
            {
              stateLabel: "poll",
              itemLabel: "Users in this roll can edit polls that they made",
              changeRoleVal: (val) => {
                roleObject.permissions.edit.poll = val;
                setEditCheckedState({
                  ...editCheckedState,
                  poll: val,
                });
              },
            },
            {
              stateLabel: "general",
              itemLabel:
                "Users in this role can edit general posts that they made",
              changeRoleVal: (val) => {
                roleObject.permissions.edit.general = val;
                setEditCheckedState({
                  ...editCheckedState,
                  general: val,
                });
              },
            },
            {
              stateLabel: "comment",
              itemLabel: "Users in this role can edit comments that they made",
              changeRoleVal: (val) => {
                roleObject.permissions.edit.comment = val;
                setEditCheckedState({
                  ...editCheckedState,
                  comment: val,
                });
              },
            },
            {
              stateLabel: "reply",
              itemLabel: "Users in this role can edit replies that they made",
              changeRoleVal: (val) => {
                roleObject.permissions.edit.reply = val;
                setEditCheckedState({
                  ...editCheckedState,
                  reply: val,
                });
              },
            },
          ],
        }}
      ></MaterialDropDownGroup>

      {/* PARTICIPATION DROPDOWN */}
      <MaterialDropDownGroup
        initialState={participationCheckedState}
        roleObject={roleObject}
        matDropShape={{
          name: "Participation",
          items: [
            {
              stateLabel: "reactions",
              itemLabel:
                "Users in this role can react to all posts, comments, and replies",
              changeRoleVal: (val) => {
                roleObject.permissions.participation.reactions = val;
                setParticipationCheckedState({
                  ...participationCheckedState,
                  reactions: val,
                });
              },
            },
            {
              stateLabel: "voteInPoll",
              itemLabel: "Users in this role can vote in all polls",
              changeRoleVal: (val) => {
                roleObject.permissions.participation.voteInPoll = val;
                setParticipationCheckedState({
                  ...participationCheckedState,
                  voteInPoll: val,
                });
              },
            },
            {
              stateLabel: "pin",
              itemLabel: "Users in this role can can pin all types of posts",
              changeRoleVal: (val) => {
                roleObject.permissions.participation.pin = val;
                setParticipationCheckedState({
                  ...participationCheckedState,
                  pin: val,
                });
              },
            },
          ],
        }}
      ></MaterialDropDownGroup>

      {/* PRIVACY DROPDOWN */}
      <MaterialDropDownGroup
        initialState={privacyCheckedState}
        roleObject={roleObject}
        matDropShape={{
          name: "Privacy",
          items: [
            {
              stateLabel: "private",
              itemLabel:
                "Users in this role can view all posts marked as private",
              changeRoleVal: (val) => {
                roleObject.permissions.privacy.private = val;
                setPrivacyCheckedState({
                  ...privacyCheckedState,
                  private: val,
                });
              },
            },
            {
              stateLabel: "anonymous",
              itemLabel:
                "Users in this role can draft anonymous posts of all types, comments, and replies",
              changeRoleVal: (val) => {
                roleObject.permissions.privacy.anonymous = val;
                setPrivacyCheckedState({
                  ...privacyCheckedState,
                  anonymous: val,
                });
              },
            },
          ],
        }}
      ></MaterialDropDownGroup>

      {/* ADMIN DROPDOWN */}
      <MaterialDropDownGroup
        initialState={adminCheckedState}
        roleObject={roleObject}
        matDropShape={{
          name: "Admin",
          items: [
            {
              stateLabel: "banUsers",
              itemLabel:
                "Users in this role can ban users in the course (does not include course creator)",
              changeRoleVal: (val) => {
                roleObject.permissions.admin.banUsers = val;
                setAdminCheckedState({
                  ...adminCheckedState,
                  banUsers: val,
                });
              },
            },
            {
              stateLabel: "removeUsers",
              itemLabel:
                "Users in this role can remove users in the course (does not include course creator)",
              changeRoleVal: (val) => {
                roleObject.permissions.admin.removeUsers = val;
                setAdminCheckedState({
                  ...adminCheckedState,
                  removeUsers: val,
                });
              },
            },
            {
              stateLabel: "deleteOther",
              itemLabel:
                "Users in this role can delete other user's posts / comments / replies",
              changeRoleVal: (val) => {
                roleObject.permissions.admin.deleteOther = val;
                setAdminCheckedState({
                  ...adminCheckedState,
                  deleteOther: val,
                });
              },
            },
            {
              stateLabel: "configure",
              itemLabel:
                "Users in this role can edit course configurations (this includes user roles and the ability to delete the course)",
              changeRoleVal: (val) => {
                roleObject.permissions.admin.configure = val;
                setAdminCheckedState({
                  ...adminCheckedState,
                  configure: val,
                });
              },
            },
            {
              stateLabel: "highlightName",
              itemLabel:
                "Users in this role with this permission will have their name highlighted orange every time they create a post, comment, or reply",
              changeRoleVal: (val) => {
                roleObject.permissions.admin.highlightName = val;
                setAdminCheckedState({
                  ...adminCheckedState,
                  highlightName: val,
                });
              },
            },
          ],
        }}
      ></MaterialDropDownGroup>

      <Button
        primary
        buttonColor={"rgba(0, 0, 0, 0.0)"}
        onClick={() => {
          // alert("This feature is work in progress.");
          LazyFetch({
            type: "delete",
            endpoint: "/courses/" + urlParams.courseId + "/roles",
            data: {
              roleId: roleObject._id,
            },
            onSuccess: (data) => {
              console.log(
                "Successful delete of role: ",
                roleObject.name,
                ". ",
                data
              );
              // let newRolesList = ;
              let newRolesList = courseRoles.filter((role) => {
                // console.log(
                //   "role._id: ",
                //   role._id,
                //   " , roleObject._id: ",
                //   roleObject._id
                // );
                return role._id != roleObject._id;
              });
              // console.log("After Filter: ", newRolesList);
              setCourseRoles(newRolesList);

              setUserList(GenerateUserList(userList, newRolesList));
            },
            onFailure: (err) => {
              console.log(
                "Failed to delete role: ",
                roleObject.name,
                ". ",
                err?.response
              );
            },
          });
        }}
      >
        <ChangeNameIcon src={CloseButtonIcon} />
      </Button>
    </RolePanelWrapper>
  );
};

RolePanel.propTypes = {
  roleObject: PropTypes.object,
  roleName: PropTypes.string,
  panelOutlineColor: PropTypes.string,
  courseRoles: PropTypes.array,
};

export default RolePanel;

const RolePanelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 1rem 0;
  padding: 0.25rem;

  /* box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07); */
  border: 2px solid
    ${(props) =>
      props.panelOutlineColor ? props.panelOutlineColor : css`#e7e7e7`};
  border-radius: 5px;
`;

const RoleNameWrapper = styled.div`
  display: flex;
  align-items: center;

  margin: 1rem;
`;

const RoleName = styled.p`
  font-size: 16px;
  font-weight: 700;
`;

const ChangeNameIcon = styled.img`
  width: 10px;
  height: 10px;
`;

// const DropdownWrapper = styled.div`
//   width: 110px;
//   height: 28px;
//   /* padding: 0.25rem; */

//   background: #e7e7e7;
//   /* border: 1px solid black; */
//   border-radius: 4px;
// `;

// const ArrowImg = styled.img`
//   height: 7px;
//   margin-left: 7px;
// `;
