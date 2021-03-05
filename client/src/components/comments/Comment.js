import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CommentReply from "./CommentReply";
import LikeImg from "../../imgs/like.svg";

const Comment = ({ comment }) => {
  return (
    <CommentWrapper>
      <CommentContent>{comment.content}</CommentContent>
      <ReplyContainer>
        <PostMetaContentWrapper className="meta">
          {/* <UserIcon src="./icons8_note.svg" /> */}
          <UserDescription>
            Reply by {comment.postedby.first + " " + comment.postedby.last}
          </UserDescription>

          <MetaIconWrapper>
            <UserDescription style={{ marginRight: 10 }}>Reply</UserDescription>
            <Icon src={LikeImg} />
            <IconValue>1</IconValue>
          </MetaIconWrapper>
        </PostMetaContentWrapper>
        {comment.replies.map((reply) => (
          <CommentReply reply={reply} />
        ))}
      </ReplyContainer>
    </CommentWrapper>
  );
};

Comment.propTypes = {};

export default Comment;

const CommentWrapper = styled.div`
  width: 100%;
  min-height: 85px;

  /* border: 1px solid red; */
  border-radius: 0.3em;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);

  :hover {
    cursor: pointer;
  }
`;

const CommentContent = styled.p`
  padding: 1em 2.2em 1em 2.2em;
  font-size: 14px;
  background-color: #fff;
  color: #979797;
  border-radius: 5px 5px 0 0;
`;

const PostMetaContentWrapper = styled.div`
  display: flex;
  flex-direction: row;

  height: 100%;
  padding-top: 0.5em;

  // border: 1px solid black;
`;

const UserIcon = styled.img`
  float: left;

  width: 19px;
  height: 19px;
  margin-right: 0.5em;

  background-color: #e0e0e0;
  border-radius: 50%;

  user-select: none;
`;

const UserDescription = styled.h5`
  user-select: none;

  color: #8c8c8c;
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

const ReplyContainer = styled.div`
  background-color: #f9f9f9;
  padding: 5px 30px;
  width: 100%;
  min-height: 40px;
`;
