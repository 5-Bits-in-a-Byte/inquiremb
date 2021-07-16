import React, { useState, useContext, useEffect } from "react";
import styled, { css } from "styled-components";
import { UserContext } from "../../context/UserProvider";
import {
  UserRoleContext,
  UserRoleDispatchContext,
} from "../../context/UserRoleProvider";
import Dropdown from "../../common/dropdown/Dropdown";
import Icon from "../../common/Icon";
import OptionDots from "../../../imgs/option-dots.svg";
import Reaction from "../../common/Reaction";
import CommentImg from "../../../imgs/comment.svg";
import { useHistory, useParams } from "react-router";
import LazyFetch from "../../common/requests/LazyFetch";
import PinIcon from "../../../imgs/pin.svg";

const accentColor = (type) => {
  switch (type) {
    case "Question":
      return "#4a86fa";
    case "Announcement":
      return "#FA6A4A";
    case "Poll":
      return "#4CAF50";
    case "General":
      return "#ededed";
    default:
      return "#4a86fa";
  }
};

const PostWrapper = ({
  condensed,
  postType,
  content,
  postObject,
  ...props
}) => {
  // console.log("PostObject: ", postObject);

  const user = useContext(UserContext);
  const userRole = useContext(UserRoleContext);

  const [isEditing, setIsEditing] = useState(false);
  const [pinnedStatus, setPinnedStatus] = useState(postObject.isPinned);

  // console.log("IsRead: ", postObject);
  const { postid } = useParams();
  const history = useHistory();
  const navigateToPost = (post) => {
    history.push({
      pathname: "/course/" + post.courseId + "/post/" + post._id,
      state: { post },
    });
  };

  const handlePin = (postObject, courseId, pin) => {
    LazyFetch({
      type: "put",
      endpoint: "/courses/" + postObject.courseId + "/pin",
      data: {
        _id: postObject._id,
        isPinned: !pin.pinnedStatus,
      },
      onSuccess: (data) => {
        console.log(
          "(PUT, 'pin') Response: ",
          data.status ? data.status : data
        );
        pin.setPinnedStatus(!pin.pinnedStatus);
        if (!postid) window.location.reload();
      },
      onFailure: (err) => {
        alert("Error pinning / unpinning post.");
        console.log("Err: ", err);
      },
    });
  };

  const handleDelete = (postId, courseId) => {
    LazyFetch({
      type: "delete",
      endpoint: "/courses/" + courseId + "/posts",
      data: { _id: postId },
      onSuccess: (data) => {
        console.log("Success: ", data);
        if (postid) history.push("/course/" + courseId);
        else window.location.reload();
      },
      onFailure: (err) => {
        alert("Error deleting post.");
        console.log("Err: ", err);
      },
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const generateEditDeleteOption = (optionType) => {
    var resultingOption;
    var role = optionType == "delete" ? userRole.delete : userRole.edit;
    if (
      postType == "Question" &&
      role.question &&
      (postObject.postedBy._id == user._id ||
        postObject.postedBy._id == user.anonymousId)
    ) {
      resultingOption = {
        onClick: () => {
          optionType == "delete"
            ? handleDelete(postObject._id, postObject.courseId)
            : handleEdit();
        },
        label: optionType == "delete" ? "Delete question" : "Edit question",
      };
    } else if (
      postType == "Announcement" &&
      role.announcement &&
      (postObject.postedBy._id == user._id ||
        postObject.postedBy._id == user.anonymousId)
    ) {
      resultingOption = {
        onClick: () => {
          optionType == "delete"
            ? handleDelete(postObject._id, postObject.courseId)
            : handleEdit();
        },
        label:
          optionType == "delete" ? "Delete announcement" : "Edit announcement",
      };
    } else if (
      postType == "Poll" &&
      role.poll &&
      (postObject.postedBy._id == user._id ||
        postObject.postedBy._id == user.anonymousId)
    ) {
      resultingOption = {
        onClick: () => {
          optionType == "delete"
            ? handleDelete(postObject._id, postObject.courseId)
            : handleEdit();
        },
        label: optionType == "delete" ? "Delete poll" : "Edit poll",
      };
    } else if (
      postType == "General" &&
      role.general &&
      (postObject.postedBy._id == user._id ||
        postObject.postedBy._id == user.anonymousId)
    ) {
      resultingOption = {
        onClick: () => {
          optionType == "delete"
            ? handleDelete(postObject._id, postObject.courseId)
            : handleEdit();
        },
        label: optionType == "delete" ? "Delete poll" : "Edit poll",
      };
    } else {
      resultingOption = null;
    }
    return resultingOption;
  };

  const generateDropdownOptions = () => {
    if (userRole) {
      let deleteOption = generateEditDeleteOption("delete");
      let editOption = generateEditDeleteOption("edit");
      let pinOption = userRole.participation.pin
        ? {
            onClick: () => {
              handlePin(postObject, postObject.courseId, {
                pinnedStatus,
                setPinnedStatus,
              });
            },
            label: pinnedStatus ? "Unpin Post" : "Pin Post",
          }
        : null;

      let result = [];

      if (postType == "Poll") {
        if (pinOption) result.push(pinOption);
        if (deleteOption) result.push(deleteOption);
      } else {
        if (pinOption) result.push(pinOption);
        if (editOption) result.push(editOption);
        if (deleteOption) result.push(deleteOption);
      }

      if (result.length == 0) return null;

      return result;
    }
    return null;
  };

  var dropdownOptions = generateDropdownOptions();

  // useEffect(() => {
  //   console.log("Pinned Status: ", pinnedStatus);
  // });

  return (
    <Wrapper
      onClick={() => {
        navigateToPost(postObject);
      }}
      sideBarColor={accentColor(postType)}
    >
      <HeaderContentWrapper>
        <CircleIcon
          isRead={postObject.read}
          accentColor={accentColor(postType)}
        />
        <PostFlag accentColor={accentColor(postType)}>
          {postType ? postType : "Question"}
        </PostFlag>
        <PostTitle style={{ cursor: "pointer" }}>
          {postObject.title ? postObject.title : "Error getting post title"}
        </PostTitle>
        <DropDownContainer>
          {pinnedStatus ? (
            <img
              src={PinIcon}
              style={{
                margin: `0 1em 0 0`,
                width: `18px`,
                height: `18px`,
              }}
            />
          ) : (
            <></>
          )}
          {userRole && dropdownOptions ? (
            <Dropdown options={dropdownOptions}>
              <Icon src={OptionDots} style={{ cursor: "pointer" }} />
            </Dropdown>
          ) : (
            <></>
          )}
        </DropDownContainer>
      </HeaderContentWrapper>
      {!condensed ? (
        <ContentWrapper
          onClick={(event) => {
            event.stopPropagation();
          }}
          postType={postType}
        >
          {postType == "Question" ||
          postType == "Announcement" ||
          postType == "General"
            ? React.cloneElement(content, { edit: { isEditing, setIsEditing } })
            : content}
        </ContentWrapper>
      ) : (
        <></>
      )}
      <HRSeperator />
      <FooterContentWrapper>
        {postObject.postedBy.anonymous ? (
          <></>
        ) : (
          <UserIcon src={postObject.postedBy.picture} />
        )}
        <UserDescription isInstructor={postObject.isInstructor}>
          Posted by {postObject.postedBy.first} {postObject.postedBy.last}
        </UserDescription>
        <ReactionSection>
          <Reaction
            reactions={postObject.reactions}
            type="post"
            id={postObject._id}
            postid={postObject._id}
          />
          <Icon
            alt={"Number of comments"}
            src={CommentImg}
            width={"22px"}
            style={{
              float: "left",
              marginRight: "8px",
              marginLeft: "20px",
              userSelect: "none",
            }}
          />
          <h5 style={{ color: "#8c8c8c", marginRight: "1em" }}>
            {postObject.comments}
          </h5>
        </ReactionSection>
      </FooterContentWrapper>
    </Wrapper>
  );
};

export default PostWrapper;

const Wrapper = styled.div`
  margin: 2em 0;
  padding: 0.5em;
  width: 100%;
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
  min-height: 100px;

  border: ${(props) => (props.postType == "Poll" ? "2px solid #e7e7e7" : "")};
  border-radius: ${(props) => (props.postType == "Poll" ? "5px" : "")};
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
  margin-left: 0.5em;
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
  margin-left: 0.5em;

  user-select: none;
  color: ${(props) => (props.isInstructor ? "#FF9900" : "#162b55")};
  /* opacity: 80%; */
  font-size: 15px;
`;

const ReactionSection = styled.div`
  display: inline-flex;
  margin-left: auto;
  height: 100%;
  align-items: center;
`;
