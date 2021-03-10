import React, { useContext, useState } from "react";
import styled from "styled-components";
import LikeImg from "../../imgs/like.svg";
import { UserContext } from "../context/UserProvider";

// Post and User to connect to backend
const Reaction = ({ likes }) => {
  const user = useContext(UserContext);
  const [reactions, setReactions] = useState({
    likes,
  });
  const [reactClicked, setClicked] = useState({
    liked: reactions.likes.includes(user._id),
  });

  const handleLike = () => {
    var temp = reactions;

    var loc = temp.likes.indexOf(user._id);

    console.log("Independent reaction component");

    if (loc === -1) {
      temp.likes.push(user._id);
      setClicked({ liked: true });
      console.log("liked post");
    } else {
      temp.likes.splice(loc, 1);
      setClicked({ liked: false });
      console.log("unliked post");
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
