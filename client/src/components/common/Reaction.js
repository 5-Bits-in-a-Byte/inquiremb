import React, { useContext, useEffect, useState } from "react";
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
import { UserRoleContext } from "../context/UserRoleProvider";
import Dropdown from "./dropdown/Dropdown";

/** Reaction Component
 * @brief Intended to be used above "Input" components to label them
 *
 * @param {object} reactions Reactions object model from the backend.
 * @param {string} type denotes the type of this reaction.
 * @param {number} id the id associated with this reaction
 * @param {number} postid id associated with the post this reaction falls within
 * @returns Reaction Component
 */
const Reaction = ({ reactions, type, id, postid, dropdown }) => {
  // console.log("reactions: ", reactions);
  const urlParams = useParams();
  const user = useContext(UserContext);
  const userRole = useContext(UserRoleContext);
  const [reactionState, setReactions] = useState(reactions);
  const [reactClicked, setClicked] = useState({
    liked: reactions.likes.includes(user._id),
    // Add more here
    gooded: reactions.goods.includes(user._id),
    helpfuled: reactions.helpfuls.includes(user._id),
  });
  // console.log("reactClicked: ", reactClicked);

  let endpoint = "/courses/" + urlParams.courseId + "/reactions";

  // This use effect is used to update state when sorting by oldest/newest posts
  useEffect(() => {
    setClicked({
      liked: reactions.likes.includes(user._id),
      gooded: reactions.goods.includes(user._id),
      helpfuled: reactions.helpfuls.includes(user._id),
    });
    setReactions(reactions);
  }, [reactions]);

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
    if (!userRole.participation.reactions) {
      alert("You cannot react to Posts/Comments/Replies/Polls.");
      return;
    }

    LazyFetch({
      type: "put",
      endpoint: endpoint,
      data: { reactionType: "like" },
      onSuccess: (data) => {
        setReactions(data.reactions);
      },
    });

    setClicked({
      ...reactClicked,
      liked: !reactClicked.liked,
    });
  };

  const handleGood = () => {
    if (!userRole.participation.reactions) {
      alert("You cannot react to Posts/Comments/Replies/Polls.");
      return;
    }

    LazyFetch({
      type: "put",
      endpoint: endpoint,
      data: { reactionType: "good" },
      onSuccess: (data) => {
        setReactions(data.reactions);
      },
    });

    setClicked({
      ...reactClicked,
      gooded: !reactClicked.gooded,
    });
  };

  const handleHelpful = () => {
    if (!userRole.participation.reactions) {
      alert("You cannot react to Posts/Comments/Replies/Polls.");
      return;
    }

    LazyFetch({
      type: "put",
      endpoint: endpoint,
      data: { reactionType: "helpful" },
      onSuccess: (data) => {
        setReactions(data.reactions);
      },
    });

    setClicked({
      ...reactClicked,
      helpfuled: !reactClicked.helpfuled,
    });
  };

  return (
    <>
      {dropdown ? (
        <>
          <Dropdown
            // stopPropagation
            options={[
              {
                onClick: handleGood,
                label: `Mark Post As Good ${reactionState.goods.length}`,
              },
              {
                onClick: handleHelpful,
                label: `Mark Post As helpful ${reactionState.helpfuls.length}`,
              },
              {
                onClick: handleLike,
                label: `Like Post ${reactionState.likes.length}`,
              },
            ]}
          >
            <ReactDropdownText>Reactions</ReactDropdownText>
          </Dropdown>
        </>
      ) : (
        <>
          <a title={"Good post"}>
            <ReactImg
              src={reactClicked.gooded ? LightbulbImg : GreyLightbulbImg}
              onClick={(event) => {
                event.stopPropagation();
                handleGood();
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
                handleHelpful();
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
      )}
    </>
  );
};

export default Reaction;

const ReactImg = styled.img`
  float: left;
  width: 22px;
  height: 22px;
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

const ReactDropdownText = styled.h5`
  padding: 0.75em;
  background-color: #f8f8f8;
  border-radius: 1em;
  font-weight: 500;

  transition: 150ms ease-out;

  :hover {
    cursor: pointer;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.25);
  }

  :active {
    cursor: pointer;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.25);

    border: 1px solid var(--inquire-blue); // for accessibility
  }
`;
