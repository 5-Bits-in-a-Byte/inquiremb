import React, { useState } from "react";
import styled from "styled-components";
import CommentReply from "./CommentReply";
import LikeImg from "../../imgs/like.svg";
import DraftTextBox from "../common/DraftTextArea";
import Button from "../common/Button";
import { useParams } from "react-router";
import LazyFetch from "../common/requests/LazyFetch";

const Comment = ({ comment, isDraft, callback }) => {
  const { postid } = useParams();
  const [content, setContent] = useState("");
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
                <UserDescription
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    toggleReply(true);
                  }}
                >
                  Reply
                </UserDescription>
                <Icon src={LikeImg} />
                <IconValue>1</IconValue>
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
