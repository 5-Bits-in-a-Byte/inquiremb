import React from "react";
import styled from "styled-components";
import CommentImg from "../../imgs/comment.svg";
import LikeImg from "../../imgs/like.svg";

const PostReactions = ({ likes, comments }) => {
  return (
    <>
      <Icon src={LikeImg} onClick={() => console.log("Clicked to like post")} />
      <IconValue>{likes}</IconValue>
      <Icon src={CommentImg} />
      <IconValue>{comments}</IconValue>
    </>
  );
};

export default PostReactions;

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
