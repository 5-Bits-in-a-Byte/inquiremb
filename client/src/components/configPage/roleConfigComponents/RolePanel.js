import React, { useState } from "react";
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

// MATERIAL UI -----------------------------------------------------------
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 100,
  },
}));
// -----------------------------------------------------------------------

const RolePanel = ({ roleObject, roleName, panelOutlineColor, ...props }) => {
  // MATERIAL UI --------------------------------
  const styleClasses = useStyles();

  const [publishAnchorEl, setPublishAnchorEl] = useState(null);

  const publishHandleClick = (event) => {
    setPublishAnchorEl(event?.currentTarget);
  };

  const publishHandleClose = () => {
    setPublishAnchorEl(null);
  };

  const [publishCheckedState, setPublishCheckedState] = useState({
    postComment: roleObject.publish.postComment,
    reply: roleObject.publish.reply,
    poll: roleObject.publish.poll,
  });

  // console.log("Publish init state: ", publishCheckedState);

  const [deleteCheckedState, setDeleteCheckedState] = useState({
    postComment: roleObject.delete.postComment,
    reply: roleObject.delete.reply,
    poll: roleObject.delete.poll,
  });

  const [editCheckedState, setEditCheckedState] = useState({
    postComment: roleObject.edit.postComment,
    reply: roleObject.edit.reply,
    poll: roleObject.edit.poll,
  });

  const [participationCheckedState, setParticipationCheckedState] = useState({
    reactions: roleObject.participation.reactions,
    voteInPoll: roleObject.participation.voteInPoll,
    pin: roleObject.participation.pin,
  });

  const [privacyCheckedState, setPrivacyCheckedState] = useState({
    private: roleObject.privacy.private,
    anonymous: roleObject.privacy.anonymous,
  });

  const [adminCheckedState, setAdminCheckedState] = useState({
    banUsers: roleObject.admin.banUsers,
    removeUsers: roleObject.admin.removeUsers,
    announce: roleObject.admin.announce,
    configure: roleObject.admin.configure,
    highlightPost: roleObject.admin.highlightPost,
  });
  // --------------------------------------------

  const [nameField, setNameField] = useState(roleName);
  const [nameFieldState, setNameFieldState] = useState(true);

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
            onChange={(e) => {
              // console.log(e.target.value);
              if (e.target.value != roleObject.roleName) {
                roleObject.roleName = e.target.value;
              }
              setNameField(e.target.value);
            }}
          >
            {nameField}
          </DraftTextArea>
        )}

        <Button
          primary
          buttonColor={"rgba(0, 0, 0, 0.0)"}
          onClick={() => {
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
              stateLabel: "postComment",
              itemLabel: "Draft Posts / Comments",
              changeRoleVal: (val) => {
                roleObject.publish.postComment = val;
                setPublishCheckedState({
                  ...publishCheckedState,
                  postComment: val,
                });
              },
            },
            {
              stateLabel: "reply",
              itemLabel: "Draft Replies",
              changeRoleVal: (val) => {
                roleObject.publish.reply = val;
                setPublishCheckedState({
                  ...publishCheckedState,
                  reply: val,
                });
              },
            },
            {
              stateLabel: "poll",
              itemLabel: "Draft Polls",
              changeRoleVal: (val) => {
                roleObject.publish.poll = val;
                setPublishCheckedState({
                  ...publishCheckedState,
                  poll: val,
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
              stateLabel: "postComment",
              itemLabel: "Delete Posts / Comments",
              changeRoleVal: (val) => {
                roleObject.delete.postComment = val;
                setDeleteCheckedState({
                  ...deleteCheckedState,
                  postComment: val,
                });
              },
            },
            {
              stateLabel: "reply",
              itemLabel: "Delete Replies",
              changeRoleVal: (val) => {
                roleObject.delete.reply = val;
                setDeleteCheckedState({
                  ...deleteCheckedState,
                  reply: val,
                });
              },
            },
            {
              stateLabel: "poll",
              itemLabel: "Delete Polls",
              changeRoleVal: (val) => {
                roleObject.delete.poll = val;
                setDeleteCheckedState({
                  ...deleteCheckedState,
                  poll: val,
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
              stateLabel: "postComment",
              itemLabel: "Edit Posts / Comments",
              changeRoleVal: (val) => {
                roleObject.edit.postComment = val;
                setEditCheckedState({
                  ...editCheckedState,
                  postComment: val,
                });
              },
            },
            {
              stateLabel: "reply",
              itemLabel: "Edit Replies",
              changeRoleVal: (val) => {
                roleObject.edit.reply = val;
                setEditCheckedState({
                  ...editCheckedState,
                  reply: val,
                });
              },
            },
            {
              stateLabel: "poll",
              itemLabel: "Edit Polls",
              changeRoleVal: (val) => {
                roleObject.edit.poll = val;
                setEditCheckedState({
                  ...editCheckedState,
                  poll: val,
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
              itemLabel: "React to Posts",
              changeRoleVal: (val) => {
                roleObject.participation.reactions = val;
                setParticipationCheckedState({
                  ...participationCheckedState,
                  reactions: val,
                });
              },
            },
            {
              stateLabel: "voteInPoll",
              itemLabel: "Vote in Polls",
              changeRoleVal: (val) => {
                roleObject.participation.voteInPoll = val;
                setParticipationCheckedState({
                  ...participationCheckedState,
                  voteInPoll: val,
                });
              },
            },
            {
              stateLabel: "pin",
              itemLabel: "Pin Posts",
              changeRoleVal: (val) => {
                roleObject.participation.pin = val;
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
              itemLabel: "Post Privately",
              changeRoleVal: (val) => {
                roleObject.privacy.private = val;
                setPrivacyCheckedState({
                  ...privacyCheckedState,
                  private: val,
                });
              },
            },
            {
              stateLabel: "anonymous",
              itemLabel: "Post Anonymously",
              changeRoleVal: (val) => {
                roleObject.privacy.anonymous = val;
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
              itemLabel: "Ban Users",
              changeRoleVal: (val) => {
                roleObject.admin.banUsers = val;
                setAdminCheckedState({
                  ...adminCheckedState,
                  banUsers: val,
                });
              },
            },
            {
              stateLabel: "removeUsers",
              itemLabel: "Remove Users",
              changeRoleVal: (val) => {
                roleObject.admin.removeUsers = val;
                setAdminCheckedState({
                  ...adminCheckedState,
                  removeUsers: val,
                });
              },
            },
            {
              stateLabel: "announce",
              itemLabel: "Draft Announcements",
              changeRoleVal: (val) => {
                roleObject.admin.announce = val;
                setAdminCheckedState({
                  ...adminCheckedState,
                  announce: val,
                });
              },
            },
            {
              stateLabel: "configure",
              itemLabel: "Edit Course Configurations",
              changeRoleVal: (val) => {
                roleObject.admin.configure = val;
                setAdminCheckedState({
                  ...adminCheckedState,
                  configure: val,
                });
              },
            },
            {
              stateLabel: "highlightPost",
              itemLabel: "Highlight Posts",
              changeRoleVal: (val) => {
                roleObject.admin.highlightPost = val;
                setAdminCheckedState({
                  ...adminCheckedState,
                  highlightPost: val,
                });
              },
            },
          ],
        }}
      ></MaterialDropDownGroup>

      <Button
        style={{ color: `red` }}
        primary
        buttonColor={"rgba(0, 0, 0, 0.0)"}
        onClick={() => {
          alert("This feature is work in progress.");
        }}
      >
        <ChangeNameIcon src={CloseButtonIcon} />
      </Button>
    </RolePanelWrapper>
  );
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
