import React from "react";
import styled, { css } from "styled-components";
import Dropdown from "../../common/dropdown/Dropdown";
import Icon from "../../common/Icon";
import OptionDots from "../../../imgs/option-dots.svg";

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

const handleDelete = () => {
  // LazyFetch({
  //   type: "delete",
  //   endpoint: endpoint,
  //   data: { _id: postid },
  //   onSuccess: (data) => {
  //     let path = "/course/" + courseId;
  //     history.push(path);
  //   },
  // });
  alert("Post Delete.");
};

const handleEdit = () => {
  alert("This feature is still a work in progress. Check back soon!");
};

const PostWrapper = ({
  contentObject,
  postType,
  isRead,
  content,
  ...props
}) => {
  const dropdownOptions = [
    { onClick: handleDelete, label: "Delete post" },
    { onClick: handleEdit, label: "Edit post" },
  ];

  return (
    <Wrapper sideBarColor={accentColor(postType)}>
      <HeaderContentWrapper>
        <CircleIcon isRead={isRead} accentColor={accentColor(postType)} />
        <PostFlag accentColor={accentColor(postType)}>
          {postType ? postType : "Question"}
        </PostFlag>
        <PostTitle>This is the post title</PostTitle>
        <DropDownContainer>
          <Dropdown options={dropdownOptions}>
            <Icon src={OptionDots} style={{ cursor: "pointer" }} />
          </Dropdown>
        </DropDownContainer>
      </HeaderContentWrapper>
      {contentObject ? <ContentWrapper>{content}</ContentWrapper> : <></>}
      <HRSeperator />
      <FooterContentWrapper>THIS WILL HOLD FOOTER CONTENT</FooterContentWrapper>
    </Wrapper>
  );
};

export default PostWrapper;

const Wrapper = styled.div`
  margin: 1em;
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
    !props.isRead && props.accentColor ? props.accentColor : "#e7e7e7"};

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

const FooterContentWrapper = styled.div`
  display: flex;
  align-items: center;

  /* padding: 5px; */
  height: 50px;

  /* border: 1px solid orange; */
`;
