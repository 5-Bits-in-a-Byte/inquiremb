import React, { useState } from "react";
import styled, { css } from "styled-components";
import InfoIcon from "../../../imgs/Info_tip.svg";
import PencilIcon from "../../../imgs/pencil.svg";
import CloseButtonIcon from "../../../imgs/close.svg";
import DraftTextArea from "../../common/DraftTextArea";
import Button from "../../common/Button";
import Checkbox from "../../common/Checkbox";
import LazyFetch from "../../common/requests/LazyFetch";
import { useHistory, useParams } from "react-router";

const max_options = 6;
const default_title = "Inquire is a great website!";
const default_options = ["Yes", "No", "Maybe"];

const accentColor = (type) => {
  switch (type) {
    case "Poll":
      return "#4CAF50";
    default:
      return "#4CAF50";
  }
};

const PollTitlePanel = ({ titleText, setTitle }) => {
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
            if (!nameFieldState) {
              setTitle(nameField);
            }

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
  const type = "Poll";
  const [options, setOptions] = useState(default_options);
  const [title, setTitle] = useState(default_title);
  const [optionCounter, setOptionCounter] = useState(1);
  const [isAnonymous, toggleAnonymous] = useState(false);
  const { courseId } = useParams();
  const history = useHistory();

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

  // Adding options; don't permit more than the max amount
  const AddOption = () => {
    const len = options.length;

    if (len >= max_options) {
      alert(
        "The maximum number of poll options is " + max_options.toString() + "."
      );
    } else {
      let newOption = "New Option " + optionCounter.toString();

      var conflict = true;
      var offset = 0;

      while (conflict) {
        var match = false;

        for (var i = 0; i < len; i++) {
          console.log(newOption + " vs " + options[i]);

          if (newOption == options[i]) {
            match = true;
            break;
          }
        }

        offset++;

        if (match) {
          newOption = "New Option " + (optionCounter + offset).toString();
        } else {
          conflict = false;
        }
      }

      setOptionCounter(optionCounter + offset);
      setOptions([...options, newOption]);
    }
  };

  // Removing options, require users to have at least one
  const RemoveOption = (index) => {
    let newOptions = [...options];
    newOptions.splice(index, 1);

    console.log(newOptions);
    if (newOptions.length > 0) {
      setOptions(newOptions);
    } else {
      alert("A Poll must have at least one option.");
    }
  };

  const handleSubmit = () => {
    LazyFetch({
      type: "post",
      endpoint: "/api/courses/" + courseId + "/posts",
      data: {
        isAnonymous: isAnonymous,
        isPrivate: false,
        title: title,
        content: {
          type: type.toLowerCase(),
          fields: options,
        },
      },
      onSuccess: (data) => {
        console.log(data);
        data.new = true;
        history.push({
          pathname: "/course/" + data.courseId + "/post/" + data._id,
          state: { post: data },
        });
      },
    });
  };

  let test_option_components = GenerateOptionList(
    options,
    TestNewOption,
    RemoveOption
  );

  return (
    <Wrapper sideBarColor={accentColor(type)}>
      <HeaderContentWrapper>
        <CircleIcon accentColor={accentColor(type)} />
        <PostFlag accentColor={accentColor(type)} selected={type === "Poll"}>
          Poll
        </PostFlag>
      </HeaderContentWrapper>
      <GroupWrapper>
        <HeaderGroup>
          <HeaderText>{"Poll Title"}</HeaderText>
        </HeaderGroup>
        <PollTitlePanel titleText={title} setTitle={setTitle} />
        <HeaderGroup>
          <HeaderText>{"Create options for your poll."}</HeaderText>
          <HeaderInfoIcon
            src={InfoIcon}
            onClick={() => {
              console.log("Config data: ", title, options);
            }}
          />
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
      <HRSeperator />
      <FooterContentWrapper>
        <ButtonSection>
          <Checkbox
            checkboxName="isAnonymous"
            labelText={"Make Anonymous"}
            onChange={() => {
              toggleAnonymous(!isAnonymous);
            }}
            checkStatus={isAnonymous}
          />
          <Button primary onClick={handleSubmit} style={{ margin: "0 1em" }}>
            Submit
          </Button>
        </ButtonSection>
      </FooterContentWrapper>
    </Wrapper>
  );
};

export default PollConfig;

const Wrapper = styled.div`
  margin: 2em;
  padding: 0.5em;
  /* width: 719px; */
  /* max-width: 900px; */
  /* min-height: 255px; */
  /* height: 255px; */

  background-color: #fff;
  /* border: 1px solid red; */
  border-left: ${(props) =>
    props.sideBarColor
      ? "5px solid " + props.sideBarColor
      : "5px solid #e7e7e7"};
  border-radius: 5px;
  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;

const HeaderContentWrapper = styled.div`
  display: flex;
  align-items: center;

  padding: 5px;
  height: 40px;

  /* border: 1px solid #4a86fa; */
`;

const CircleIcon = styled.div`
  padding: 5px;
  width: 10px;
  height: 10px;

  background-color: ${(props) =>
    props.accentColor ? props.accentColor : "#e7e7e7"};

  border-radius: 50%;
`;

const PostFlag = styled.div`
  margin-left: 1em;
  padding: 2px 5px;
  color: ${(props) => (props.selected ? "#fff" : "#000")};
  background-color: ${(props) =>
    props.selected ? props.accentColor : "#e7e7e7"};
  border-radius: 2px;
`;

const HRSeperator = styled.hr`
  margin: 5px 0;
  padding: 0 0 0 0;
  border: 1px solid #e7e7e7;
  border-radius: 5px;
`;

const FooterContentWrapper = styled.div`
  display: flex;
  align-items: center;

  /* padding: 5px; */
  height: 50px;

  /* border: 1px solid orange; */
`;

const ButtonSection = styled.div`
  display: inline-flex;
  margin-left: auto;
  height: 100%;
  align-items: center;
`;

// Styles for the Poll config wrapper component - very similar to the roles configuration panel styles

const GroupWrapper = styled.div`
  width: 100%;
  margin: 1rem 1rem 1rem 0;
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
