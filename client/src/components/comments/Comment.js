import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CommentReply from "./CommentReply";
import LikeImg from "../../imgs/like.svg";
import DraftTextBox from "../common/DraftTextArea";
import Button from "../common/Button";

var dummy_reaction_IDs = ["test_user_1", "test_user_2", "test_user_3"];
var dummy_current_user = "my_user_ID";

const Comment = ({ comment, isDraft, callback }) => {
  const [content, setContent] = useState("");
  const [reactions, setReactions] = useState({ likes: dummy_reaction_IDs });
  const [reactCounts, setCounts] = useState({
    likeCount: Object.keys(reactions.likes).length,
  });
  const [reactClicked, setClicked] = useState({
    liked: reactions.likes.includes(dummy_current_user),
  });

  const renderContent = () => {
    if (isDraft) {
      return <DraftTextBox onChange={handleChange} />;
    }
    // Otherwise, the post has been fetched from the API so return the content
    else {
      return comment.content;
    }
  };

  // Used for the text box to create a new post
  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleLike = () => {
    var temp = reactions;

    var loc = temp.likes.indexOf(dummy_current_user);

    if (loc === -1) {
      temp.likes.push(dummy_current_user);
      setClicked({ liked: true });
      console.log("liked");
    } else {
      temp.likes.splice(loc, 1);
      setClicked({ liked: false });
      console.log("unliked");
    }

    var newCounts = reactCounts;
    newCounts.likeCount = Object.keys(reactions.likes).length;

    setCounts(newCounts);
    setReactions(temp);
    console.log(reactions.likes);
    console.log("New count is: ", reactCounts.likeCount);
  };

  return (
    <CommentWrapper>
      <CommentContent>{renderContent()}</CommentContent>
      <ReplyContainer>
        <PostMetaContentWrapper className="meta">
          {/* <UserIcon src="./icons8_note.svg" /> */}
          <UserDescription>
            Reply by {comment.postedby.first + " " + comment.postedby.last}
          </UserDescription>

          <MetaIconWrapper>
            {isDraft ? (
              <>
                <Button
                  secondary
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    callback();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  primary
                  onClick={() => {
                    callback(content);
                  }}
                >
                  Submit
                </Button>
              </>
            ) : (
              <>
                <UserDescription style={{ marginRight: 10 }}>
                  Reply
                </UserDescription>
                <Icon src={LikeImg} onClick={() => handleLike()} />
                <IconValue>{reactCounts.likeCount}</IconValue>
              </>
            )}
          </MetaIconWrapper>
        </PostMetaContentWrapper>
        {comment.replies &&
          comment.replies.length > 0 &&
          comment.replies.map((reply) => <CommentReply reply={reply} />)}
      </ReplyContainer>
    </CommentWrapper>
  );
};

Comment.propTypes = {};

export default Comment;

const CommentWrapper = styled.div`
  width: 100%;
  min-height: 85px;
  margin: 17px 0;
  /* border: 1px solid red; */
  border-radius: 0.3em;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);

  :hover {
    cursor: pointer;
  }
`;

const CommentContent = styled.p`
  padding: 1em 2.2em 1em 2.2em;
  font-size: 16px;
  background-color: #fff;
  border-radius: 5px 5px 0 0;
`;

const PostMetaContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  padding: 0.5em 0;
  align-items: center;
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
