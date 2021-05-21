import React, { useState } from "react";
import styled, { css } from "styled-components";
import InfoIcon from "../../../imgs/Info_tip.svg";
import PencilIcon from "../../../imgs/pencil.svg";
import CloseButtonIcon from "../../../imgs/close.svg";
import DraftTextArea from "../../common/DraftTextArea";
import Button from "../../common/Button";

const max_options = 6;
const default_title = "Inquire is a great website!";
const default_options = ["Yes", "No", "Maybe"];

const PollTitlePanel = ({ titleText }) => {
  const [nameField, setNameField] = useState(titleText);
  const [nameFieldState, setNameFieldState] = useState(true);

  return (
    <PollAttributeWrapper>
      <PollDetailPanel>
        {nameFieldState ? (
          <PollOptionName style={{ margin: `0 1rem 0 0` }}>
            {nameField}
          </PollOptionName>
        ) : (
          <DraftTextArea
            minRows={1}
            style={{ width: `75%`, marginRight: `1em` }}
            onChange={(e) => {
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
      </PollDetailPanel>
    </PollAttributeWrapper>
  );
};

const PollOptionPanel = ({
  value,
  optionText,
  testNewOption,
  removeOption,
  ...props
}) => {
  const [nameField, setNameField] = useState(optionText);
  const [cachedNameField, setcachedNameField] = useState(optionText);
  const [nameFieldState, setNameFieldState] = useState(true);

  return (
    <PollAttributeWrapper>
      <PollDetailPanel>
        {nameFieldState ? (
          <PollOptionName style={{ margin: `0 1rem 0 0` }}>
            {nameField}
          </PollOptionName>
        ) : (
          <DraftTextArea
            minRows={1}
            style={{ width: `150px`, marginRight: `1em` }}
            onChange={(e) => {
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
            if (!nameFieldState) {
              if (testNewOption(value, nameField)) {
                setcachedNameField(nameField);
              } else {
                setNameField(cachedNameField);
              }
            }
            setNameFieldState(!nameFieldState);
          }}
        >
          <ChangeNameIcon src={PencilIcon} />
        </Button>
      </PollDetailPanel>

      <Button
        primary
        buttonColor={"rgba(0, 0, 0, 0.0)"}
        onClick={() => {
          removeOption(value);
          setNameField(optionText);
          setcachedNameField(optionText);
        }}
      >
        <ChangeNameIcon src={CloseButtonIcon} />
      </Button>
    </PollAttributeWrapper>
  );
};

/**
 * Generates a list of Poll Option Components for State Management
 */
const GenerateOptionList = (options, testNewOption, removeOption) => {
  return options.map((option, index) => (
    <PollOptionPanel
      key={option}
      value={index}
      optionText={option}
      testNewOption={testNewOption}
      removeOption={removeOption}
    />
  ));
};

/**
 * Verifies that the array has no duplicates.
 * Strings are converted to uppercase; comparison is not case-sensitive.
 */
const StringConflictCheck = (newOptions) => {
  var upperNewOptions = [...newOptions];

  //console.log(upperNewOptions);

  const len = upperNewOptions.length;

  for (var i = 0; i < len; i++) {
    upperNewOptions[i] = upperNewOptions[i].toUpperCase();
  }

  //console.log(upperNewOptions);

  for (var i = 0; i < len - 1; i++) {
    for (var j = i + 1; j < len; j++) {
      //console.log(upperNewOptions[i] + " vs " + upperNewOptions[j]);

      if (upperNewOptions[i] == upperNewOptions[j]) {
        console.log("From checker, Conflict");
        return true;
      }
    }
  }

  console.log("From checker, No conflict");

  return false;
};

const PollConfig = ({ children, ...props }) => {
  const [options, setOptions] = useState(default_options);
  const [optionCounter, setOptionCounter] = useState(1);

  const TestNewOption = (index, newOption) => {
    var newOptions = [...options];
    newOptions[index] = newOption;

    if (StringConflictCheck(newOptions)) {
      alert("Options must all be different.");
      console.log("No change to options");
      return false;
    }
    console.log("Setting options");
    setOptions(newOptions);

    return true;
  };

  // Removing options, require users to have at least one
  const RemoveOption = (index) => {
    let newOptions = [...options];
    newOptions.splice(index, 1);

    //console.log(newOptions);
    if (newOptions.length > 0) {
      setOptions(newOptions);
    } else {
      alert("A Poll must have at least one option.");
    }
  };

  // Adding options; don't permit more than the max amount
  const AddOption = () => {
    if (options.length >= max_options) {
      alert(
        "The maximum number of poll options is " + max_options.toString() + "."
      );
    } else {
      let newOption = "New Option " + optionCounter.toString();
      setOptions([...options, newOption]);
      setOptionCounter(optionCounter + 1);
    }
  };

  let test_option_components = GenerateOptionList(
    options,
    TestNewOption,
    RemoveOption
  );

  return (
    <GroupWrapper>
      <HeaderGroup>
        <HeaderText>{"Poll Title"}</HeaderText>
      </HeaderGroup>
      <PollTitlePanel titleText={default_title} />
      <HeaderGroup>
        <HeaderText>{"Create options for your poll."}</HeaderText>
        <HeaderInfoIcon src={InfoIcon} />
      </HeaderGroup>
      {test_option_components}
      <Button
        secondary
        buttonWidth={"175px"}
        buttonHeight={"36px"}
        onClick={() => {
          AddOption();
        }}
      >
        + Add a New Option
      </Button>
    </GroupWrapper>
  );
};

export default PollConfig;

// Styles for the Poll config wrapper component - very similar to the roles configuration panel styles

const GroupWrapper = styled.div`
  width: 50%;
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

// Styles for the Poll Options and Poll Title panels - very similar to role panel styles

const PollAttributeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.5rem 0;
  padding: 0.25rem;
  border: 2px solid
    ${(props) =>
      props.panelOutlineColor ? props.panelOutlineColor : css`#e7e7e7`};
  border-radius: 5px;
`;

const PollDetailPanel = styled.div`
  display: flex;
  align-items: center;

  margin: 0.5rem;
`;

const PollOptionName = styled.p`
  font-size: 16px;
  font-weight: 700;
`;

const ChangeNameIcon = styled.img`
  width: 10px;
  height: 10px;
`;
