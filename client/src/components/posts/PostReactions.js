import React, { useState } from "react";
import styled from "styled-components";
import CommentImg from "../../imgs/comment.svg";
import LikeImg from "../../imgs/like.svg";

var dummy_reaction_IDs = [];
var dummy_current_user = "my_user_ID";

// Post and User to connect to backend
const PostReactions = ({ post, user, comments }) => {
  const [reactions, setReactions] = useState({
    likes: [...dummy_reaction_IDs],
  });
  const [reactCounts, setCounts] = useState({
    likeCount: Object.keys(reactions.likes).length,
  });
  const [reactClicked, setClicked] = useState({
    liked: reactions.likes.includes(dummy_current_user),
  });

  const handleLike = () => {
    var temp = reactions;

    var loc = temp.likes.indexOf(dummy_current_user);

    if (loc === -1) {
      temp.likes.push(dummy_current_user);
      setClicked({ liked: true });
      console.log("liked post");
    } else {
      temp.likes.splice(loc, 1);
      setClicked({ liked: false });
      console.log("unliked post");
    }

    var newCounts = reactCounts;
    newCounts.likeCount = Object.keys(reactions.likes).length;

    setCounts(newCounts);
    setReactions(temp);
    console.log(reactions.likes);
    console.log("New post count is: ", reactCounts.likeCount);
  };

  return (
    <>
      <Icon src={LikeImg} onClick={handleLike} clicked={reactClicked.liked} />
      <IconValue>{reactCounts.likeCount}</IconValue>
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
  opacity: ${(props) => (!props.clicked && "50%") || "100%"};
`;

const IconValue = styled.h5`
  color: #8c8c8c;
`;
