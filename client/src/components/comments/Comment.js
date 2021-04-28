import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import CommentReply from "./CommentReply";
import DraftTextBox from "../common/DraftTextArea";
import Button from "../common/Button";
import { useParams } from "react-router";
import LazyFetch from "../common/requests/LazyFetch";
import Reaction from "../common/Reaction";
import Dropdown from "../common/dropdown/Dropdown";
import Icon from "../common/Icon";
import OptionDots from "../../imgs/option-dots.svg";

const Comment = ({ comment, isDraft, callback }) => {
  const { postid } = useParams();
  const [content, setContent] = useState("");

  const [newReplies, setNewReplies] = useState([]);
  const [isReplying, toggleReply] = useState(false);

  const endpoint = "/api/posts/" + postid + "/comments";

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
        endpoint: endpoint + "/" + comment._id + "/replies",
        data: { content, isAnonymous: false },
        onSuccess: (data) => {
          toggleReply(false);
          setNewReplies([
            ...newReplies,
            <CommentReply reply={data} key={data._id} postid={postid} />,
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
      replies.push(
        <CommentReply reply={reply} postid={postid} key={reply._id} />
      );
    });
  }
  // Insert new replies that were created from state
  replies = [...replies, ...newReplies];

  // If the user clicks reply, insert a drafted reply
  if (isReplying) {
    replies.push(
      <CommentReply isDraft submitReply={submitReply} postid={postid} key={0} />
    );
  }

  const handleDelete = () => {
    console.log("handleDelete");
    LazyFetch({
      type: "delete",
      endpoint: endpoint,
      data: { _id: comment._id },
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
    { onClick: handleDelete, label: "Delete comment" },
    { onClick: handleEdit, label: "Edit comment" },
  ];

  return (
    <CommentWrapper>
      <Content>
        <CommentContent>{renderContent()}</CommentContent>
        {!isDraft && (
          <Dropdown options={options} style={{ paddingRight: "10px" }}>
            <Icon src={OptionDots} />
          </Dropdown>
        )}
      </Content>
      <ReplyContainer>
        <PostMetaContentWrapper className="meta">
          <UserDescription>
            by {comment.postedBy.first + " " + comment.postedBy.last}
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
                <Reaction
                  reactions={comment.reactions}
                  type="comment"
                  id={comment._id}
                  postid={postid}
                />

                <ReplyBtn
                  style={{ marginRight: 10, marginLeft: 20 }}
                  onClick={() => {
                    toggleReply(true);
                  }}
                >
                  Reply
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
  border-radius: 0.3em;
  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;

const CommentContent = styled.p`
  padding: 1em 2.2em 1em 2.2em;
  flex: 1;
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

const ReplyContainer = styled.div`
  background-color: #f9f9f9;
  padding: 5px 30px;
  width: 100%;
  min-height: 40px;
  border-radius: 0 0 0.3em 0.3em;
`;

const Content = styled.div`
  display: flex;
  /* justify-content: flex-end; */
  background-color: #fff;
  padding: 10px 10px 0px 0px;
`;

// const Placeholder = styled.div`
//   flex: 1;
// `;
