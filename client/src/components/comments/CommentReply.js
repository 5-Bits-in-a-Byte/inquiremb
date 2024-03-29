import React, { useState, useContext } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { UserContext } from "../context/UserProvider";
import Button from "../common/Button";
import Reaction from "../common/Reaction";
import LazyFetch from "../common/requests/LazyFetch";
import Dropdown from "../common/dropdown/Dropdown";
import Icon from "../common/Icon";
import OptionDots from "../../imgs/option-dots.svg";
import { Editor } from "react-draft-wysiwyg";
import EditorWrapper from "../posts/wrappers/EditorWrapper";
import { EditorState } from "draft-js";
import Checkbox from "../common/Checkbox";
import { UserRoleContext } from "../context/UserRoleProvider";
import MaterialCheckbox from "../common/MaterialCheckbox";

const CommentReply = ({
  reply,
  isDraft,
  submitReply,
  postid,
  commentid,
  userRole,
}) => {
  const user = useContext(UserContext);
  const { courseId } = useParams();

  const [isAnonymous, toggleIsAnonymous] = useState(false);
  const [content, setContent] = useState({
    raw: EditorState.createEmpty(),
    plainText: EditorState.createEmpty(),
  });
  const [isEditing, setIsEditing] = useState(false);

  // '/posts/<string:postId>/comments/<string:comment_id>/replies'
  const endpoint =
    "/courses/" +
    courseId +
    "/posts/" +
    postid +
    "/comments/" +
    commentid +
    "/replies";

  const handleContentChange = (e) => {
    const plainText = e.getCurrentContent().getPlainText();
    setContent({ raw: e, plainText: plainText });
  };

  const imageCallback = async (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("imageFile", file);

      LazyFetch({
        type: "post",
        endpoint: "/images",
        data: formData,
        onSuccess: (data) => {
          resolve({ data: { link: data.data.link } });
        },
      });
    });
  };

  if (isDraft) {
    reply = {
      _id: null,
      // content: <DraftTextArea onChange={handleChange} value={draft} />,
      content: (
        <Editor
          name="content"
          editorStyle={{
            minHeight: "100px",
            padding: "0 8px",
            border: "2px solid #e7e7e7",
            borderRadius: "5px",
          }}
          onEditorStateChange={handleContentChange}
          toolbar={{
            options: [
              "inline",
              "list",
              "link",
              "emoji",
              "history",
              "blockType",
              "image",
            ],
            image: {
              uploadCallback: imageCallback,
              uploadEnabled: true,
              previewImage: true,
              defaultSize: { width: "600" },
            },
          }}
        />
      ),
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
        alert("Error deleting Reply, Response: ", err.response);
      },
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const generateDropdownOptions = () => {
    if (userRole) {
      let deleteOption =
        userRole.delete.reply &&
        (reply.postedBy._id == user._id ||
          reply.postedBy._id == user.anonymousId)
          ? {
              onClick: handleDelete,
              label: "Delete reply",
            }
          : null;
      let editOption =
        userRole.edit.reply &&
        (reply.postedBy._id == user._id ||
          reply.postedBy._id == user.anonymousId)
          ? { onClick: handleEdit, label: "Edit Reply" }
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

  const renderContent = () => {
    if (isDraft) {
      return (
        <Editor
          name="content"
          editorStyle={{
            minHeight: "100px",
            padding: "0 8px",
            border: "2px solid #e7e7e7",
            borderRadius: "5px",
          }}
          onEditorStateChange={handleContentChange}
          toolbar={{
            options: [
              "inline",
              "list",
              "link",
              "emoji",
              "history",
              "blockType",
              "image",
            ],
            image: {
              uploadCallback: imageCallback,
              uploadEnabled: true,
              previewImage: true,
              defaultSize: { width: "600" },
            },
          }}
        />
      );
    }
    // Otherwise, the post has been fetched from the API so return the content
    else {
      const content = (
        <EditorWrapper
          messageData={reply}
          messageType="reply"
          edit={false}
          commentId={commentid}
        />
      );
      return React.cloneElement(content, { edit: { isEditing, setIsEditing } });
    }
  };

  return (
    <CommentReplyWrapper>
      <Content>
        {/* <CommentReplyContent>{reply.content}</CommentReplyContent> */}
        <CommentReplyContent>{renderContent()}</CommentReplyContent>

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
        <UserDescription isInstructor={reply.isInstructor}>
          by{" "}
          {!isAnonymous
            ? reply.postedBy.first + " " + reply.postedBy.last
            : "Anonymous"}
        </UserDescription>

        <MetaIconWrapper>
          {isDraft ? (
            <>
              {userRole && userRole.privacy.anonymous ? (
                <MaterialCheckbox
                  label="Make Anonymous"
                  checkedState={{
                    checked: isAnonymous,
                    toggleChecked: toggleIsAnonymous,
                  }}
                />
              ) : (
                <></>
              )}
              <Button
                largeSecondary
                onClick={() => submitReply(null)}
                style={{ marginRight: 10 }}
              >
                Cancel
              </Button>
              <Button primary onClick={() => submitReply(isAnonymous, content)}>
                Submit
              </Button>
            </>
          ) : (
            <>
              {userRole && userRole.participation.reactions && (
                <Reaction
                  reactions={reply.reactions}
                  type="reply"
                  id={reply._id}
                  postid={postid}
                />
              )}
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
  color: ${(props) => (props.isInstructor ? "#FF9900" : "#8c8c8c")};
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
