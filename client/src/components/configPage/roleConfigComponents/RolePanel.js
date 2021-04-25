import React, { useState } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import Button from "../../common/Button";
import PencilIcon from "../../../imgs/pencil.svg";
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

const publishTest = {
  postComment: true,
  reply: true,
  poll: true,
};

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
        roleObject={roleObject}
        matDropShape={{
          name: "Publish",
          items: [
            {
              itemLabel: "Post / Comment",
              changeRoleVal: (val) => {
                roleObject.publish.postComment = val;
              },
            },
            {
              itemLabel: "Reply",
              changeRoleVal: (val) => {
                roleObject.publish.reply = val;
              },
            },
            {
              itemLabel: "Poll",
              changeRoleVal: (val) => {
                roleObject.publish.poll = val;
              },
            },
          ],
        }}
      ></MaterialDropDownGroup>

      {/* DELETE DROPDOWN */}
      <MaterialDropDownGroup
        roleObject={roleObject}
        matDropShape={{
          name: "Delete",
          items: [
            {
              itemLabel: "Post / Comment",
              changeRoleVal: (val) => {
                roleObject.delete.postComment = val;
              },
            },
            {
              itemLabel: "Reply",
              changeRoleVal: (val) => {
                roleObject.delete.reply = val;
              },
            },
            {
              itemLabel: "Poll",
              changeRoleVal: (val) => {
                roleObject.delete.poll = val;
              },
            },
          ],
        }}
      ></MaterialDropDownGroup>

      {/* PARTICIPATION DROPDOWN */}
      <MaterialDropDownGroup
        roleObject={roleObject}
        matDropShape={{
          name: "Participation",
          items: [
            {
              itemLabel: "Reactions",
              changeRoleVal: (val) => {
                roleObject.participation.reactions = val;
              },
            },
            {
              itemLabel: "Vote in Poll",
              changeRoleVal: (val) => {
                roleObject.participation.voteInPoll = val;
              },
            },
            {
              itemLabel: "Pin",
              changeRoleVal: (val) => {
                roleObject.participation.pin = val;
              },
            },
          ],
        }}
      ></MaterialDropDownGroup>

      {/* EDIT DROPDOWN */}
      <MaterialDropDownGroup
        roleObject={roleObject}
        matDropShape={{
          name: "Edit",
          items: [
            {
              itemLabel: "Post / Comment",
              changeRoleVal: (val) => {
                roleObject.edit.postComment = val;
              },
            },
            {
              itemLabel: "Reply",
              changeRoleVal: (val) => {
                roleObject.edit.reply = val;
              },
            },
            {
              itemLabel: "Poll",
              changeRoleVal: (val) => {
                roleObject.edit.poll = val;
              },
            },
          ],
        }}
      ></MaterialDropDownGroup>

      {/* PRIVACY DROPDOWN */}
      <MaterialDropDownGroup
        roleObject={roleObject}
        matDropShape={{
          name: "Privacy",
          items: [
            {
              itemLabel: "Post Privately",
              changeRoleVal: (val) => {
                roleObject.privacy.private = val;
              },
            },
            {
              itemLabel: "Post Anonymously",
              changeRoleVal: (val) => {
                roleObject.privacy.anonymous = val;
              },
            },
          ],
        }}
      ></MaterialDropDownGroup>

      {/* ADMIN DROPDOWN */}
      <MaterialDropDownGroup
        roleObject={roleObject}
        matDropShape={{
          name: "Admin",
          items: [
            {
              itemLabel: "Ban Users",
              changeRoleVal: (val) => {
                roleObject.admin.banUsers = val;
              },
            },
            {
              itemLabel: "Remove Users",
              changeRoleVal: (val) => {
                roleObject.admin.removeUsers = val;
              },
            },
            {
              itemLabel: "Announce",
              changeRoleVal: (val) => {
                roleObject.admin.announce = val;
              },
            },
            {
              itemLabel: "Configure",
              changeRoleVal: (val) => {
                roleObject.admin.configure = val;
              },
            },
            {
              itemLabel: "Highlight Post",
              changeRoleVal: (val) => {
                roleObject.admin.highlightPost = val;
              },
            },
          ],
        }}
      ></MaterialDropDownGroup>
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
