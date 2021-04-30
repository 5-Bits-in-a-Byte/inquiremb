import React, { useState, useContext } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { UserContext } from "../context/UserProvider";
import DraftTextArea from "../common/DraftTextArea";
import Button from "../common/Button";
import Reaction from "../common/Reaction";
import LazyFetch from "../common/requests/LazyFetch";
import Dropdown from "../common/dropdown/Dropdown";
import Icon from "../common/Icon";
import OptionDots from "../../imgs/option-dots.svg";

const CommentReply = ({ reply, isDraft, submitReply, postid, commentid }) => {
  const user = useContext(UserContext);
  const [draft, setDraft] = useState("");
  const { courseId } = useParams();

  // '/posts/<string:postId>/comments/<string:comment_id>/replies'
  const endpoint =
    "/api/courses/" +
    courseId +
    "/posts/" +
    postid +
    "/comments/" +
    commentid +
    "/replies";

  const handleChange = (e) => {
    setDraft(e.target.value);
  };

  if (isDraft) {
    reply = {
      _id: null,
      content: <DraftTextArea onChange={handleChange} value={draft} />,
      postedBy: { first: user.first, last: user.last, _id: user._id },
      reactions: { likes: [] },
    };
  }

  const handleDelete = () => {
    LazyFetch({
      type: "delete",
      endpoint: endpoint,
      data: { _id: reply._id },
      onSuccess: () => {
        window.location.reload();
      },
      onFailure: (err) => {
        alert(err.response);
      },
    });
  };

  const handleEdit = () => {
    alert("This feature is still a work in progress. Check back soon!");
  };

  const options = [
    { onClick: handleDelete, label: "Delete reply" },
    { onClick: handleEdit, label: "Edit reply" },
  ];

  // Initialize viewOptions to see if a user should be able to see dropdown options
  var viewOptions = false;
  // Check to see if the user is an admin
  for (let i = 0; i < user.courses.length; i++) {
    if (user?.courses[i].courseId == courseId) {
      viewOptions = user.courses[i].admin;
    }
  }
  // Check to see if the user made the post
  if (
    !isDraft &&
    (reply.postedBy._id == user._id || reply.postedBy._id == user.anonymousId)
  ) {
    viewOptions = true;
  }

  return (
    <CommentReplyWrapper>
      <Content>
        <CommentReplyContent>{reply.content}</CommentReplyContent>
        {!isDraft && viewOptions && (
          <Dropdown options={options}>
            <Icon
              src={OptionDots}
              style={{ padding: "0 1rem 0 0", cursor: "pointer" }}
            />
          </Dropdown>
        )}
      </Content>
      <ReplyMetaContentWrapper className="meta">
        <UserDescription>
          by{" "}
          {reply &&
            reply.postedBy &&
            reply.postedBy.first + " " + reply.postedBy.last}
        </UserDescription>

        <MetaIconWrapper>
          {isDraft ? (
            <>
              <Button
                largeSecondary
                onClick={() => submitReply(null)}
                style={{ marginRight: 10 }}
              >
                Cancel
              </Button>
              <Button primary onClick={() => submitReply(draft)}>
                Submit
              </Button>
            </>
          ) : (
            <>
              <Reaction
                reactions={reply.reactions}
                type="reply"
                id={reply._id}
                postid={postid}
              />
            </>
          )}
        </MetaIconWrapper>
      </ReplyMetaContentWrapper>
    </CommentReplyWrapper>
  );
};

export default CommentReply;

const CommentReplyWrapper = styled.div`
  background-color: #fff;
  width: 100%;
  margin: 18px 0;
  border-radius: 5px;
  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
  /* border-left: 4px solid gainsboro; */
`;

const CommentReplyContent = styled.p`
  margin: 0 2.2em 1em 2.2em;
  padding-top: 1em;
  font-size: 16px;
  flex: 1;
`;

const ReplyMetaContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5em 2.2em;
  width: 100%;
  min-height: 1.5em;
  background-color: #f9f9f9;
  border-radius: 5px;
`;

const UserDescription = styled.h5`
  user-select: none;
  color: #8c8c8c;
`;

const MetaIconWrapper = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  background-color: #fff;
  padding: 10px 10px 0px 0px;
  border-radius: 5px;
`;
