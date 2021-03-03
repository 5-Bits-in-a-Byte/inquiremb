import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Comment = ({ posterName }) => {
  return (
    <CommentWrapper>
      <CommentContent>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic libero vero
        consequatur magnam error quis aut, magni, cupiditate vel sequi,
        accusamus voluptatum beatae nulla.
      </CommentContent>

      <ReplyContainer>
        <PostMetaContentWrapper className="meta">
          {/* <UserIcon src="./icons8_note.svg" /> */}
          <UserDescription>Reply by {posterName}</UserDescription>

          <MetaIconWrapper>
            <UserDescription>Reply</UserDescription>
            <Icon src="./icons8_facebook_like 1.svg" />
            <IconValue>1</IconValue>
          </MetaIconWrapper>
        </PostMetaContentWrapper>
      </ReplyContainer>
    </CommentWrapper>
  );
};

Comment.propTypes = {};

export default Comment;

const CommentWrapper = styled.div`
  width: 720px;
  min-height: 85px;

  /* border: 1px solid red; */
  border-radius: 0.3em;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);

  :hover {
    cursor: pointer;
  }
`;

const CommentContent = styled.p`
  margin: 0 2.2em 1em 2.2em;
  padding-top: 1em;
  font-size: 14px;

  color: #979797;
`;

const PostMetaContentWrapper = styled.div`
  display: flex;
  flex-direction: row;

  height: 100%;
  margin: 0 2.2em 0.5em 2.2em;
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
  margin-left: 400px;

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
  background-color: #ededed;

  width: 100%;
  min-height: 40px;
`;
