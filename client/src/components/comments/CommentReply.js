import React, { useState, useContext } from "react";
import styled from "styled-components";
import LikeImg from "../../imgs/like.svg";
import { UserContext } from "../context/UserProvider";
import DraftTextArea from "../common/DraftTextArea";
import Button from "../common/Button";

const CommentReply = ({ reply, isDraft, submitReply }) => {
  const user = useContext(UserContext);
  const [draft, setDraft] = useState("");
  const handleChange = (e) => {
    setDraft(e.target.value);
  };

  if (isDraft) {
    reply = {
      _id: null,
      content: <DraftTextArea onChange={handleChange} value={draft} />,
      postedby: { first: user.first, last: user.last, _id: user._id },
      reactions: { likes: [] },
    };
  }
  console.log(reply);
  return (
    <CommentReplyWrapper>
      <CommentReplyContent>{reply.content}</CommentReplyContent>
      <ReplyMetaContentWrapper className="meta">
        <UserDescription>
          by{" "}
          {reply &&
            reply.postedby &&
            reply.postedby.first + " " + reply.postedby.last}
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
              <Icon src={LikeImg} />
              <IconValue>1</IconValue>
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
  border-radius: 0.3em;
  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;

const CommentReplyContent = styled.p`
  margin: 0 2.2em 1em 2.2em;
  padding-top: 1em;
  font-size: 16px;
`;

const ReplyMetaContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5em 2.2em;
  width: 100%;
  min-height: 1.5em;
  background-color: #ededed;
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
