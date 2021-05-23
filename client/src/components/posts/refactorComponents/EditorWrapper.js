import React, { useState } from "react";
import styled, { css } from "styled-components";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import Button from "../../common/Button";

const convertToUpper = (postType) => {
  var first = postType[0].toUpperCase();
  var rest = postType.slice(1);
  return first + rest;
};

const EditorWrapper = ({ post, edit }) => {
  const postType = convertToUpper(post.content.type);

  const [content, setContent] = useState({
    type: postType,
    raw: post.content.raw,
    plainText: post.content.plainText,
  });

  const [editorStateTest, setEditorStateTest] = useState(
    EditorState.createWithContent(convertFromRaw(post.content.raw))
  );

  const handleContentChange = (e) => {
    // console.log("e: ", e);
    // setContent({
    //   ...content,
    //   raw: convertToRaw(e.getCurrentContent()),
    //   plainText: e.getCurrentContent().getPlainText(),
    // });
    // console.log("Content: ", content.raw);
    // console.log("Post.Content: ", post.content.raw);
    setEditorStateTest(e);
  };

  const handleSubmit = () => {
    alert("W.I.P.");
  };

  const handleCancel = () => {
    edit.setIsEditing(false);
    setEditorStateTest(
      EditorState.createWithContent(convertFromRaw(post.content.raw))
    );
  };

  return (
    <>
      {edit.isEditing ? (
        <Editor
          name="content"
          // editorState={EditorState.createWithContent(
          //   convertFromRaw(content.raw)
          // )}
          // editorState={EditorState.createWithContent(
          //   convertFromRaw(post.content.raw)
          // )}
          editorState={editorStateTest}
          editorStyle={{
            // backgroundColor: "#f1f1f1",
            minHeight: "100px",
            padding: "0 8px",
            maxHeight: "200px",
            overflow: "hidden",
            border: "2px solid #e7e7e7",
            borderRadius: "5px",
          }}
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
          onEditorStateChange={handleContentChange}
        />
      ) : (
        <Editor
          readOnly
          toolbarHidden
          name="content"
          editorState={editorStateTest}
          editorStyle={{
            // backgroundColor: "#f1f1f1",
            minHeight: "100px",
            padding: "0 8px",
            maxHeight: "200px",
            overflow: "hidden",
            border: "2px solid #e7e7e7",
            borderRadius: "5px",
          }}
          // placeholder="Details"
          // onEditorStateChange={handleContentChange}
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
              onClick={handleSubmit}
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
