import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "../../common/Button";
import PencilIcon from "../../../imgs/pencil.svg";
import Input from "../../common/Input";
import DraftTextArea from "../../common/DraftTextArea";
import Dropdown from "../../common/dropdown/Dropdown";
import Arrow from "../../../imgs/carrot-down-secondary.svg";

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

const RolePanel = ({ roleObject, roleName, ...props }) => {
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
    <RolePanelWrapper>
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
      <DropdownWrapper>
        <Button
          primary
          buttonWidth={"110px"}
          buttonHeight={"28px"}
          onClick={publishHandleClick}
        >
          Publish
        </Button>
        <Menu
          id="Publish Menu"
          anchorEl={publishAnchorEl}
          keepMounted
          open={Boolean(publishAnchorEl)}
          onClose={publishHandleClose}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    console.log("Post / Comment Changed: ", e.target.checked);
                    roleObject.publish.postComment = e.target.checked;
                  }}
                />
              }
              label={"Post / Comment"}
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    console.log("Reply Changed: ", e.target.checked);
                    roleObject.publish.reply = e.target.checked;
                  }}
                />
              }
              label={"Reply"}
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    console.log("Poll Changed: ", e.target.checked);
                    roleObject.publish.poll = e.target.checked;
                  }}
                />
              }
              label={"Poll"}
            />
          </FormGroup>
        </Menu>
      </DropdownWrapper>
    </RolePanelWrapper>
  );
};

export default RolePanel;

const RolePanelWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  padding: 0.25rem;

  /* box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07); */
  border: 2px solid #e7e7e7;
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

const DropdownWrapper = styled.div`
  width: 110px;
  height: 28px;
  /* padding: 0.25rem; */

  background: #e7e7e7;
  /* border: 1px solid black; */
  border-radius: 4px;
`;

const ArrowImg = styled.img`
  height: 7px;
  margin-left: 7px;
`;
