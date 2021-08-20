import React, { useState } from "react";
import styled, { css } from "styled-components";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import Button from "../common/Button";
import LazyFetch from "../common/requests/LazyFetch";
import { useParams } from "react-router";

const generateStyle = (edit, postid, messageType) => {
  var styling;
  if ((messageType == "comment" || messageType == "reply") && !edit.isEditing) {
    styling = {
      padding: "0 8px",
      overflow: "hidden",
      borderRadius: "5px",
    };
  } else if (!edit.isEditing && !postid) {
    styling = {
      minHeight: "100px",
      padding: "0 8px",
      maxHeight: "200px",
      overflow: "hidden",
      border: "2px solid #e7e7e7",
      borderRadius: "5px",
    };
  } else {
    styling = {
      minHeight: "100px",
      padding: "0 8px",
      overflow: "hidden",
      border: "2px solid #e7e7e7",
      borderRadius: "5px",
    };
  }
  return styling;
};

const EditorWrapper = ({ messageData, messageType, edit, commentId }) => {
  const { courseId, postid } = useParams();
  const [editorStateTest, setEditorStateTest] = useState(
    EditorState.createWithContent(convertFromRaw(messageData.content.raw))
  );

  const [plainText, setPlainText] = useState(messageData.content.plainText);

  const handleContentChange = (e) => {
    setEditorStateTest(e);
    setPlainText(e.getCurrentContent().getPlainText());
  };

  const handlePostSubmit = () => {
    LazyFetch({
      type: "put",
      endpoint: "/courses/" + courseId + "/posts",
      data: {
        content: {
          type: messageData.content.type,
          raw: convertToRaw(editorStateTest.getCurrentContent()),
          plainText: plainText,
        },
        title: messageData.title,
        isPinned: messageData.isPinned,
        _id: messageData._id,
      },
      onSuccess: (data) => {
        console.log(data);
        edit.setIsEditing(false);
      },
      onFailure: (err) => {
        console.log("Error: ", err.errors ? err.errors : err);
        alert("Error updating post.");
      },
    });
  };

  const handleCommentSubmit = () => {
    LazyFetch({
      type: "put",
      endpoint: "/courses/" + courseId + "/posts/" + postid + "/comments",
      data: {
        content: {
          raw: convertToRaw(editorStateTest.getCurrentContent()),
          plainText: plainText,
        },
        _id: messageData._id,
      },
      onSuccess: (data) => {
        console.log(data);
        edit.setIsEditing(false);
      },
      onFailure: (err) => {
        console.log("Error: ", err.errors ? err.errors : err);
        alert("Error updating comment.");
      },
    });
  };

  const handleReplySubmit = () => {
    LazyFetch({
      type: "put",
      endpoint:
        "/courses/" +
        courseId +
        "/posts/" +
        postid +
        "/comments/" +
        commentId +
        "/replies",
      data: {
        content: {
          raw: convertToRaw(editorStateTest.getCurrentContent()),
          plainText: plainText,
        },
        _id: messageData._id,
      },
      onSuccess: (data) => {
        console.log(data);
        edit.setIsEditing(false);
      },
      onFailure: (err) => {
        console.log("Error: ", err.errors ? err.errors : err);
        alert("Error updating comment.");
      },
    });
  };

  const handleCancel = () => {
    edit.setIsEditing(false);
    setEditorStateTest(
      EditorState.createWithContent(convertFromRaw(messageData.content.raw))
    );
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

  /** This variable is used to determine whether or not to force a maximum height for this containing element. */
  var editorStyle = generateStyle(edit, postid, messageType);

  return (
    <>
      {edit.isEditing ? (
        <Editor
          name="content"
          editorState={editorStateTest}
          editorStyle={editorStyle}
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
            },
          }}
          onEditorStateChange={handleContentChange}
        />
      ) : (
        <Editor
          readOnly
          toolbarHidden
          name="content"
          editorState={editorStateTest}
          editorStyle={editorStyle}
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
            },
          }}
        />
      )}
      {edit.isEditing ? (
        <SubmitButtonContainer>
          <ButtonContainer style={{ marginLeft: `auto` }}>
            <Button
              secondary
              buttonWidth={`5em`}
              buttonHeight={`2.5em`}
              onClick={handleCancel}
              style={{ margin: `0 1em` }}
            >
              Cancel
            </Button>
            <Button
              primary
              buttonWidth={`10em`}
              buttonHeight={`2.5em`}
              onClick={() => {
                if (messageType == "post") {
                  handlePostSubmit();
                } else if (messageType == "comment") {
                  handleCommentSubmit();
                } else if (messageType == "reply") {
                  handleReplySubmit();
                }
              }}
            >
              Submit Changes
            </Button>
          </ButtonContainer>
        </SubmitButtonContainer>
      ) : (
        <></>
      )}
    </>
  );
};

export default EditorWrapper;

const SubmitButtonContainer = styled.div`
  display: flex;
  align-items: center;

  /* padding: 5px; */
  height: 50px;

  /* border: 1px solid orange; */
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;
