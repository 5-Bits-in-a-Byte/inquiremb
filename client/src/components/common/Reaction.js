import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import UnlikedImg from "../../imgs/like_grey.svg";
import LikedImg from "../../imgs/like_blue.svg";
import LightbulbImg from "../../imgs/lightbulb.svg";
import GreenPlusImg from "../../imgs/green-plus.svg";
import GreyPlusImg from "../../imgs/grey-plus.svg";
import GreyLightbulbImg from "../../imgs/lightbulb-grey.svg";
import { UserContext } from "../context/UserProvider";
import LazyFetch from "./requests/LazyFetch";

/** Reaction Component
 * @brief Intended to be used above "Input" components to label them
 *
 * @param {object} reactions Reactions object model from the backend.
 * @param {string} type denotes the type of this reaction.
 * @param {number} id the id associated with this reaction
 * @param {number} postid id associated with the post this reaction falls within
 * @returns Reaction Component
 */
const Reaction = ({ reactions, type, id, postid }) => {
  console.log("reactions: ", reactions);
  const urlParams = useParams();
  const user = useContext(UserContext);
  const [reactionState, setReactions] = useState(reactions);
  const [reactClicked, setClicked] = useState({
    liked: reactions.likes.includes(user._id),
    // Add more here
    gooded: reactions.goods.includes(user._id),
    helpfuled: reactions.helpfuls.includes(user._id),
  });
  console.log("reactClicked: ", reactClicked);

  let endpoint = "/api/courses/" + urlParams.courseId + "/reactions";

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
    LazyFetch({
      type: "put",
      endpoint: endpoint,
      data: null,
      onSuccess: (data) => {
        setReactions(data.reactions);
      },
    });

    var loc = reactionState.likes.indexOf(user._id);

    if (loc === -1) {
      setClicked({ liked: true });
    } else {
      setClicked({ liked: false });
    }
  };

  return (
    <>
      <a title={"Good post"}>
        <ReactImg
          src={reactClicked.gooded ? LightbulbImg : GreyLightbulbImg}
          onClick={(event) => {
            event.stopPropagation();
            handleLike();
          }}
          clicked={reactClicked.gooded}
          postid={postid}
        />
      </a>
      <ReactValue>{reactionState.goods.length}</ReactValue>
      <a title={"Helpful post"}>
        <ReactImg
          src={reactClicked.helpfuled ? GreenPlusImg : GreyPlusImg}
          onClick={(event) => {
            event.stopPropagation();
            handleLike();
          }}
          clicked={reactClicked.helpfuled}
          postid={postid}
        />
      </a>
      <ReactValue>{reactionState.helpfuls.length}</ReactValue>
      <a title={"Like post"}>
        <ReactImg
          src={reactClicked.liked ? LikedImg : UnlikedImg}
          onClick={(event) => {
            event.stopPropagation();
            handleLike();
          }}
          clicked={reactClicked.liked}
          postid={postid}
        />
      </a>
      <ReactValue>{reactionState.likes.length}</ReactValue>
    </>
  );
};

export default Reaction;

const ReactImg = styled.img`
  float: left;
  width: 18px;
  height: 18px;
  margin-right: 8px;
  margin-left: 20px;
  user-select: none;
  /* cursor: ${(props) => (props.postid ? "pointer" : "default")}; */
  cursor: pointer;
  opacity: ${(props) => (!props.clicked && "100%") || "100%"};
`;

const ReactValue = styled.h5`
  color: #8c8c8c;
`;
