import React, { useContext, useState } from "react";
import styled from "styled-components";
import CommentReply from "./CommentReply";
import LikeImg from "../../imgs/like.svg";
import DraftTextBox from "../common/DraftTextArea";
import Button from "../common/Button";
import { useParams } from "react-router";
import LazyFetch from "../common/requests/LazyFetch";
import { UserContext } from "../context/UserProvider";

var dummy_reaction_IDs = [];

const Comment = ({ comment, isDraft, callback }) => {
  const { postid } = useParams();
  const [content, setContent] = useState("");
  const user = useContext(UserContext);
  const [reactions, setReactions] = useState({
    likes: [...dummy_reaction_IDs],
  });
  const [reactClicked, setClicked] = useState({
    liked: reactions.likes.includes(user._id),
  });

  const [newReplies, setNewReplies] = useState([]);
  const [isReplying, toggleReply] = useState(false);

  const renderContent = () => {
    if (isDraft) {
      return <DraftTextBox onChange={handleChange} />;
    }
    // Otherwise, the post has been fetched from the API so return the content
    else {
      return comment.content;
    }
  };

  // Create or cancel the reply here (depends on if content is passed)
  const submitReply = (content = null) => {
    if (!content) {
      toggleReply(false);
    } else {
      LazyFetch({
        type: "post",
        endpoint:
          "/api/posts/" + postid + "/comments/" + comment._id + "/replies",
        data: { content, isAnonymous: false },
        onSuccess: (data) => {
          toggleReply(false);
          setNewReplies([
            ...newReplies,
            <CommentReply reply={data} key={data._id} />,
          ]);
        },
      });
    }
  };

  // Used for the text box to create a new post
  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleLike = () => {
    var temp = reactions;

    var loc = temp.likes.indexOf(user._id);

    if (loc === -1) {
      temp.likes.push(user._id);
      setClicked({ liked: true });
      console.log("liked comment");
    } else {
      temp.likes.splice(loc, 1);
      setClicked({ liked: false });
      console.log("unliked comment");
    }

    setReactions(temp);
    console.log(reactions.likes);
  };

  // Collect replies from comment data and append any newly created replies (if applicable)
  let replies = [];
  if (comment.replies && comment.replies.length > 0) {
    comment.replies.forEach((reply) => {
      replies.push(<CommentReply reply={reply} />);
    });
  }
  // Insert new replies that were created from state
  replies = [...replies, ...newReplies];

  // If the user clicks reply, insert a drafted reply
  if (isReplying) {
    replies.push(<CommentReply isDraft submitReply={submitReply} />);
  }

  return (
    <CommentWrapper>
      <CommentContent>{renderContent()}</CommentContent>
      <ReplyContainer>
        <PostMetaContentWrapper className="meta">
          {/* <UserIcon src="./icons8_note.svg" /> */}
          <UserDescription>
            by {comment.postedby.first + " " + comment.postedby.last}
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
                <ReplyBtn
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    toggleReply(true);
                  }}
                >
                  Reply
                  <Icon
                    src={LikeImg}
                    onClick={() => handleLike()}
                    clicked={reactClicked.liked}
                  />
                  <IconValue>{reactions.likes.length}</IconValue>
                </ReplyBtn>
              </>
            )}
          </MetaIconWrapper>
        </PostMetaContentWrapper>
        {replies}
      </ReplyContainer>
    </CommentWrapper>
  );
};

export default Comment;

const CommentWrapper = styled.div`
  width: 100%;
  min-height: 85px;
  margin: 17px 0;
  /* border: 1px solid red; */
  border-radius: 0.3em;
  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
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
  color: #8c8c8c;
`;

const ReplyBtn = styled.h5`
  cursor: pointer;
  color: #8c8c8c;
  &:hover {
    text-decoration: underline;
  }
`;

const MetaIconWrapper = styled.div`
  display: inline-flex;
  margin-left: auto;
  height: 100%;
`;

const Icon = styled.img`
  float: left;

  width: 18px;
  height: auto;
  margin-right: 1em;
  margin-left: 0.75em;

  user-select: none;
  opacity: ${(props) => (!props.clicked && "50%") || "100%"};
`;

const IconValue = styled.h5`
  color: #8c8c8c;
`;

const ReplyContainer = styled.div`
  background-color: #f9f9f9;
  padding: 5px 30px;
  width: 100%;
  min-height: 40px;
  border-radius: 0 0 0.3em 0.3em;
`;
