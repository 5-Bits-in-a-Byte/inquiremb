import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import LazyFetch from "../../common/requests/LazyFetch";
import styled, { css } from "styled-components";
import InfoIcon from "../../../imgs/Info_tip.svg";
import PencilIcon from "../../../imgs/pencil.svg";
import CloseButtonIcon from "../../../imgs/close.svg";
import Input from "../../common/Input";
import DraftTextArea from "../../common/DraftTextArea";
import Button from "../../common/Button";

const PollOptionPanel = ({
  roleObject,
  roleName,
  panelOutlineColor,
  courseRoles,
  setCourseRoles,
  ...props
}) => {
  const urlParams = useParams();

  const [nameField, setNameField] = useState(roleName);
  const [nameFieldState, setNameFieldState] = useState(true);

  // console.log("This role id: ", props.value);

  return (
    <OptionPanelWrapper panelOutlineColor={panelOutlineColor}>
      <OptionNameWrapper>
        {nameFieldState ? (
          <OptionName style={{ margin: `0 1rem 0 0` }}>{nameField}</OptionName>
        ) : (
          <DraftTextArea
            minRows={1}
            style={{ width: `150px`, marginRight: `1em` }}
            onChange={(e) => {
              // console.log(e.target.value);
              if (e.target.value != roleObject.name) {
                roleObject.name = e.target.value;
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
      </OptionNameWrapper>

      <Button primary buttonColor={"rgba(0, 0, 0, 0.0)"} onClick={() => {}}>
        <ChangeNameIcon src={CloseButtonIcon} />
      </Button>
    </OptionPanelWrapper>
  );
};

const test_options = [];

/**
 * Generates a list of Poll Option Components for State Management
 */
const GenerateOptionList = (roles, setRoles, userList, setUserList) => {
  return roles.map((role, index) => (
    <PollOptionPanel
      key={index}
      value={index}
      roleObject={role}
      roleName={role?.name}
      panelOutlineColor={role?.roleColor}
      courseRoles={roles}
      setCourseRoles={setRoles}
    />
  ));
};

const PollConfig = ({ panelHeader, children, ...props }) => {
  return (
    <GroupWrapper>
      <HeaderGroup>
        <HeaderText>{panelHeader}</HeaderText>
        <HeaderInfoIcon src={InfoIcon} />
      </HeaderGroup>
      {children}
      <Button
        secondary
        buttonWidth={"207px"}
        buttonHeight={"48px"}
        onClick={() => {}}
      >
        + Add a New Option
      </Button>
    </GroupWrapper>
  );
};

export default PollConfig;

const GroupWrapper = styled.div`
  margin: 1rem;
  padding: 2rem;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
  border-radius: 5px;
`;

const HeaderGroup = styled.div`
  display: flex;
  align-items: center;

  padding: 0.25rem;
`;

const HeaderText = styled.p`
  margin: 0 0.5rem 0 0;

  font-size: 16px;
  font-weight: 600;
  text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
`;

const HeaderInfoIcon = styled.img`
  width: 16px;
  height: 16px;
`;

// Styles for the Poll Options panels - modelled after role panel styles

const OptionPanelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 1rem 0;
  padding: 0.25rem;
  border: 2px solid
    ${(props) =>
      props.panelOutlineColor ? props.panelOutlineColor : css`#e7e7e7`};
  border-radius: 5px;
`;

const OptionNameWrapper = styled.div`
  display: flex;
  align-items: center;

  margin: 1rem;
`;

const OptionName = styled.p`
  font-size: 16px;
  font-weight: 700;
`;

const ChangeNameIcon = styled.img`
  width: 10px;
  height: 10px;
`;
