import React, { useContext, useState } from "react";
import styled from "styled-components";
import LikeImg from "../../imgs/like.svg";
import { UserContext } from "../context/UserProvider";

// Post and User to connect to backend
const Reaction = ({ likes, type, id }) => {
  const user = useContext(UserContext);
  const [reactions, setReactions] = useState({
    likes,
  });
  const [reactClicked, setClicked] = useState({
    liked: reactions.likes.includes(user._id),
  });
  let endpoint = "/api/reactions";

  switch (type) {
    case "post":
      endpoint += "?postid=" + id;
      break;
    case "comment":
      endpoint += "?commentid=" + id;
      break;
    case "reply":
      endpoint += "?replyid=" + id;
      break;
    default:
    // Don't add a filter to endpoint
  }

  const handleLike = () => {
    var temp = reactions;

    var loc = temp.likes.indexOf(user._id);

    if (loc === -1) {
      temp.likes.push(user._id);
      setClicked({ liked: true });
    } else {
      temp.likes.splice(loc, 1);
      setClicked({ liked: false });
    }

    setReactions(temp);
    console.log(reactions.likes);
  };

  return (
    <>
      <Icon src={LikeImg} onClick={handleLike} clicked={reactClicked.liked} />
      <IconValue>{reactions.likes.length}</IconValue>
    </>
  );
};

export default Reaction;

const Icon = styled.img`
  float: left;
  width: 18px;
  height: 18px;
  margin-right: 8px;
  margin-left: 20px;
  user-select: none;
  opacity: ${(props) => (!props.clicked && "50%") || "100%"};
`;

const IconValue = styled.h5`
  color: #8c8c8c;
`;
