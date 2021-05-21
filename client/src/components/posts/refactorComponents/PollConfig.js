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
  optionObject,
  optionText,
  panelOutlineColor,
  ...props
}) => {
  const urlParams = useParams();

  const [nameField, setNameField] = useState(optionText);
  const [nameFieldState, setNameFieldState] = useState(true);

  // console.log("This role id: ", props.value);

  return (
    <PollOptionPanelWrapper panelOutlineColor={panelOutlineColor}>
      <PollOptionNameWrapper>
        {nameFieldState ? (
          <PollOptionName style={{ margin: `0 1rem 0 0` }}>
            {nameField}
          </PollOptionName>
        ) : (
          <DraftTextArea
            minRows={1}
            style={{ width: `150px`, marginRight: `1em` }}
            onChange={(e) => {
              // console.log(e.target.value);
              if (e.target.value != optionObject.name) {
                optionObject.name = e.target.value;
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
      </PollOptionNameWrapper>

      <Button primary buttonColor={"rgba(0, 0, 0, 0.0)"} onClick={() => {}}>
        <ChangeNameIcon src={CloseButtonIcon} />
      </Button>
    </PollOptionPanelWrapper>
  );
};

const test_options = [
  "Spaghetti",
  "Burrito",
  "Lasagna",
  "Pizza",
  "Salad",
  "Sandwich",
];

/**
 * Generates a list of Poll Option Components for State Management
 */
const GenerateOptionList = (options) => {
  return options.map((option, index) => (
    <PollOptionPanel
      key={index}
      value={index}
      optionObject={{ name: option }}
      optionText={option}
      panelOutlineColor={"#000000"}
    />
  ));
};

const PollDraftWrapper = ({ panelHeader, children, ...props }) => {
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

const PollConfig = ({ ...props }) => {
  return (
    <PollDraftWrapper
      panelHeader={"Create options for your poll."}
    ></PollDraftWrapper>
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

// Styles for the Poll Options panels - same as role panel styles

const PollOptionPanelWrapper = styled.div`
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

const PollOptionNameWrapper = styled.div`
  display: flex;
  align-items: center;

  margin: 1rem;
`;

const PollOptionName = styled.p`
  font-size: 16px;
  font-weight: 700;
`;

const ChangeNameIcon = styled.img`
  width: 10px;
  height: 10px;
`;
