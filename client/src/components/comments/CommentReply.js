import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import LikeImg from "../../imgs/like.svg";

const CommentReply = ({ posterName }) => {
  return (
    <CommentReplyWrapper>
      <CommentReplyContent>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
        voluptatem nemo dolor quo corporis quas quasi qui provident cumque,
        quisquam quos quod minima libero.
      </CommentReplyContent>
      <ReplyMetaContentWrapper className="meta">
        <UserDescription>Reply by {posterName}</UserDescription>

        <MetaIconWrapper>
          <Icon src={LikeImg} />
          <IconValue>1</IconValue>
        </MetaIconWrapper>
      </ReplyMetaContentWrapper>
    </CommentReplyWrapper>
  );
};

CommentReply.propTypes = {};

export default CommentReply;

const CommentReplyWrapper = styled.div`
  width: 90%;
  min-height: 85px;
  margin: 1em auto;

  /* border: 1px solid red; */
  border-radius: 0.3em;
  background-color: #f8f8f8;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);

  :hover {
    cursor: pointer;
  }
`;

const CommentReplyContent = styled.p`
  margin: 0 2.2em 1em 2.2em;
  padding-top: 1em;
  font-size: 14px;

  color: #979797;
`;

const ReplyMetaContentWrapper = styled.div`
  display: flex;
  flex-direction: row;

  width: 100%;
  min-height: 1.5em;
  /* margin: 0 2.2em 0.5em 2.2em; */
  /* padding-top: 0.5em; */

  // border: 1px solid black;
  background-color: #ededed;
`;

const UserDescription = styled.h5`
  user-select: none;

  color: #8c8c8c;

  margin: auto 2em;
  line-height: 1.5em;
  font-size: 12px;
`;

const MetaIconWrapper = styled.div`
  display: inline-flex;
  margin-left: 400px;

  height: 1.75em;
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
