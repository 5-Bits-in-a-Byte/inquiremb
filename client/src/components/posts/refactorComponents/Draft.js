import React, { useState } from "react";
import styled, { css } from "styled-components";
import DraftTextArea from "../../common/DraftTextArea";
import Checkbox from "../../common/Checkbox";
import Button from "../../common/Button";
import Icon from "../../common/Icon";

const accentColor = (type) => {
  switch (type) {
    case "Question":
      return "#4a86fa";
    case "Announcement":
      return "#FA6A4A";
    case "Poll":
      return "#4CAF50";
    default:
      return "#4a86fa";
  }
};

const Draft = () => {
  // State and handler for drafting posts
  const [draft, setDraft] = useState({
    title: "",
    content: "",
    isAnonymous: false,
    isPrivate: false,
  });

  const [postType, setPostType] = useState("Question");

  const handleChange = (e) => {
    setDraft({
      ...draft,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  var titlePlaceholder = postType ? postType + " title" : "Post title";

  return (
    <Wrapper sideBarColor={accentColor(postType)}>
      <HeaderContentWrapper>
        <CircleIcon accentColor={accentColor(postType)} />
        <PostFlag accentColor={accentColor(postType)}>Question</PostFlag>
      </HeaderContentWrapper>
      <DraftTextArea
        minRows={1}
        placeholder={titlePlaceholder}
        onChange={handleChange}
        name="title"
      />
      <DraftTextArea
        secondary
        placeholder="Details"
        onChange={handleChange}
        name="content"
      />
      <HRSeperator />
      <FooterContentWrapper>
        <ButtonSection>
          <Checkbox
            checkboxName="isAnonymous"
            labelText={"Make Anonymous"}
            onChange={handleChange}
            checkStatus={draft.isAnonymous}
          />
          <Checkbox
            checkboxName="isPrivate"
            labelText={"Make Private"}
            onChange={handleChange}
            checkStatus={draft.isPrivate}
          />
          <Button
            primary
            onClick={() => console.log("submit")}
            style={{ margin: "0 1em" }}
          >
            Submit
          </Button>
        </ButtonSection>
      </FooterContentWrapper>
    </Wrapper>
  );
};

export default Draft;

const Wrapper = styled.div`
  margin: 2em;
  padding: 0.5em;
  width: 719px;
  max-width: 900px;
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
//#region
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

const PostTitle = styled.h1`
  /* margin-left: 1em; */
  padding: 5px;
  font-size: 18px;
`;

const PostFlag = styled.div`
  margin-left: 1em;
  padding: 2px 5px;
  color: #fff;
  background-color: ${(props) =>
    props.accentColor ? props.accentColor : "#e7e7e7"};
  border-radius: 2px;
`;

const DropDownContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;

  margin-left: auto;
  margin-bottom: 0.5em;

  /* background-color: #e7e7e7; */
`;

//#endregion

const ContentWrapper = styled.div`
  padding: 5px;
  min-height: 145px;
  border: 2px solid #e7e7e7;
  border-radius: 5px;
`;

const HRSeperator = styled.hr`
  margin: 5px 0;
  padding: 0 0 0 0;
  border: 1px solid #e7e7e7;
  border-radius: 5px;
`;

const UserIcon = styled.img`
  /* float: left; */
  width: 36px;
  height: 36px;
  margin-right: 0.5em;
  border-radius: 50%;
  user-select: none;
`;

const FooterContentWrapper = styled.div`
  display: flex;
  align-items: center;

  /* padding: 5px; */
  height: 50px;

  /* border: 1px solid orange; */
`;

const UserDescription = styled.h5`
  user-select: none;
  color: ${(props) => (props.isInstructor ? "#FF9900" : "#A7A7A7")};
  opacity: 80%;
  font-size: 15px;
`;

const ButtonSection = styled.div`
  display: inline-flex;
  margin-left: auto;
  height: 100%;
  align-items: center;
`;
