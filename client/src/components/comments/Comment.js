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
import { UserContext } from "../context/UserProvider";
import { UserRoleContext } from "../context/UserRoleProvider";
import EditorWrapper from "../posts/refactorComponents/EditorWrapper";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState } from "draft-js";

const Comment = ({ comment, isDraft, callback }) => {
  // console.log("Comment Role Object: ", userRole);
  const { courseId, postid } = useParams();
  const user = useContext(UserContext);
  const userRole = useContext(UserRoleContext);

  const [newReplies, setNewReplies] = useState([]);
  const [isReplying, toggleReply] = useState(false);

  const [content, setContent] = useState({
    raw: EditorState.createEmpty(),
    plainText: EditorState.createEmpty(),
  });

  const endpoint = "/courses/" + courseId + "/posts/" + postid + "/comments";

  const handleContentChange = (e) => {
    const plainText = e.getCurrentContent().getPlainText();
    setContent({ raw: e, plainText: plainText });
    // console.log(content);
  };

  const renderContent = () => {
    if (isDraft) {
      // return <DraftTextBox onChange={handleChange} />;
      return (
        <Editor
          name="content"
          editorStyle={{
            // backgroundColor: "#f1f1f1",
            minHeight: "100px",
            padding: "0 8px",
            border: "2px solid #e7e7e7",
            borderRadius: "5px",
          }}
          // placeholder="Details"
          onEditorStateChange={handleContentChange}
          toolbar={{
            options: [
              "inline",
              "list",
              "link",
              "emoji",
              "history",
              "blockType",
            ],
          }}
        />
      );
    }
    // Otherwise, the post has been fetched from the API so return the content
    else {
      // return comment.content;
      return <EditorWrapper messageData={comment} edit={false} />;
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
            <CommentReply
              reply={data}
              key={data._id}
              postid={postid}
              userRole={userRole}
              commentid={comment._id}
            />,
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
        <CommentReply
          reply={reply}
          postid={postid}
          key={reply._id}
          commentid={comment._id}
          userRole={userRole}
        />
      );
    });
  }
  // Insert new replies that were created from state
  replies = [...replies, ...newReplies];

  // If the user clicks reply, insert a drafted reply
  if (isReplying) {
    replies.push(
      <CommentReply
        isDraft
        submitReply={submitReply}
        postid={postid}
        key={0}
        userRole={userRole}
        commentid={comment._id}
      />
    );
  }

  const handleDelete = () => {
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

  const generateDropdownOptions = () => {
    if (userRole) {
      let deleteOption =
        userRole.delete.postComment && comment.postedBy._id == user._id
          ? {
              onClick: handleDelete,
              label: "Delete Comment",
            }
          : null;
      let editOption =
        userRole.edit.postComment && comment.postedBy._id == user._id
          ? { onClick: handleEdit, label: "Edit Comment" }
          : null;

      let result = [];

      if (deleteOption) result.push(deleteOption);
      if (editOption) result.push(editOption);

      if (result.length == 0) return null;

      return result;
    }
    return null;
  };

  var options = generateDropdownOptions();
  // = [
  //   { onClick: handleDelete, label: "Delete comment" },
  //   { onClick: handleEdit, label: "Edit comment" },
  // ];

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
    (comment.postedBy._id == user._id ||
      comment.postedBy._id == user.anonymousId)
  ) {
    viewOptions = true;
  }

  return (
    <CommentWrapper>
      <Content>
        <CommentContent>{renderContent()}</CommentContent>
        {!isDraft && viewOptions && (
          <Dropdown options={options}>
            <Icon
              src={OptionDots}
              style={{ padding: "0 1rem 0 0", cursor: "pointer" }}
            />
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
  border-radius: 5px;
  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;

const CommentContent = styled.p`
  padding: 1em 2.2em 1em 2.2em;
  flex: 1;
  font-size: 16px;
  background-color: #fff;
  border-radius: 5px;
`;

const PostMetaContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  padding: 0.5em 0 0 0;
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
  background-color: #fff;
  padding: 10px 10px 0px 0px;
  border-radius: 5px;
`;
