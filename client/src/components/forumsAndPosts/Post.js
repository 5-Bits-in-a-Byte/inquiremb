import React from "react";
import styled, { css } from "styled-components";
import CommentImg from "../../imgs/comment.svg";
import LikeImg from "../../imgs/like.svg";
import PinImg from "../../imgs/pin.svg";
import { Link } from "react-router-dom";

const Post = ({ courseid, post, isCondensed }) => {
  console.log("here", post);
  const pin =
    post.isPinned === true ? { visibility: "visible" } : VisibilityHidden;

  return (
    <PostWrapper
      isCondensed={isCondensed}
      to={{
        pathname: "/course/" + courseid + "/post/" + post._id,
        state: { post },
      }}
    >
      <PostTitle isCondensed={isCondensed}>{post.title}</PostTitle>

      <PinIcon style={pin} src={PinImg} />

      {!isCondensed && <PostContent>{post.content}</PostContent>}

      {!isCondensed && <hr style={HRStyle} />}

      <PostMetaContentWrapper className="meta">
        <UserIcon src="./icons8_note.svg" />
        <UserDescription>
          Posted by {post.postedby.first + " " + post.postedby.last}
        </UserDescription>

        <MetaIconWrapper>
          <Icon src={LikeImg} />
          <IconValue>1</IconValue>

          <Icon src={CommentImg} />
          <IconValue>1</IconValue>
        </MetaIconWrapper>
      </PostMetaContentWrapper>
    </PostWrapper>
  );
};

export default Post;

const VisibilityHidden = {
  visibility: "hidden",
};

const HRStyle = {
  width: "100%",
  border: "1px solid #DDDDDD",
  margin: "16px 0",
};

//#region Post Stylings
const PostWrapper = styled(Link)`
  position: relative;
  padding: 23px 30px;
  display: flex;
  flex-direction: column;
  flex: 1;
  text-decoration: none;
  width: 100%;
  min-height: 85px;

  /* Height is commented out so that Posts change height dynamically 
     depending on size of content */
  /* height: ${(props) => (props.isCondensed && "150px") || "85px"}; */

  margin: 2em 0;

  // border: 1px solid black;
  border-radius: 0.3em;
  background: #fff;
  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);

  :hover {
    cursor: pointer;
  }
`;

const PostTitle = styled.h2`
  /* margin: 1em 0 0.5em 2em; */
  font-size: ${(props) => (!props.isCondensed && "18px") || "14px"};
`;

const PinIcon = styled.img`
  position: absolute;
  top: 0;
  right: 0;

  width: 16px;
  height: 16px;
  margin: 1.1em 2em 0 0;
`;

const PostContent = styled.p`
  margin-top: 10px;
  font-size: 16px;
  color: #979797;
`;

const PostMetaContentWrapper = styled.div`
  display: flex;
  flex-direction: row;

  height: 100%;
  // border: 1px solid black;
`;

const UserIcon = styled.img`
  float: left;
  width: 19px;
  height: 19px;
  margin-right: 0.5em;
  border-radius: 50%;
  user-select: none;
`;

const UserDescription = styled.h5`
  user-select: none;
`;

const MetaIconWrapper = styled.div`
  display: inline-flex;
  margin-left: auto;

  height: 100%;
`;

const Icon = styled.img`
  float: left;

  width: 18px;
  height: 18px;
  margin-right: 1em;
  margin-left: 0.75em;

  user-select: none;
`;

const IconValue = styled.h5`
  color: #8c8c8c;
`;
//#endregion
