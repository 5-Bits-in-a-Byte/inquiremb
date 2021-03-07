import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import LikeImg from "../../imgs/like.svg";

const CommentReply = ({ reply }) => {
  return (
    <CommentReplyWrapper>
      <CommentReplyContent>{reply.content}</CommentReplyContent>
      <ReplyMetaContentWrapper className="meta">
        <UserDescription>
          Reply by {reply.postedby.first + " " + reply.postedby.last}
        </UserDescription>
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
  background-color: #fff;
  width: 100%;
  margin: 18px 0;
  min-height: 85px;
  border-radius: 0.3em;
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
  align-items: center;
  padding: 5px 2.2em;
  width: 100%;
  min-height: 1.5em;
  background-color: #ededed;
`;

const UserDescription = styled.h5`
  user-select: none;
  color: #8c8c8c;
  font-size: 12px;
`;

const MetaIconWrapper = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
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
