import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";

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

  const handleContentChange = (e) => {
    console.log("e: ", e);
    const plainText = e.getCurrentContent().getPlainText();
    setContent({ ...content, raw: e, plainText: plainText });
  };

  return (
    <>
      {edit ? (
        <Editor
          name="content"
          editorState={EditorState.createWithContent(
            convertFromRaw(post.content.raw)
          )}
          // editorState={EditorState.createEmpty()}
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
          editorState={EditorState.createWithContent(
            convertFromRaw(post.content.raw)
          )}
          // editorState={EditorState.createEmpty()}
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
    </>
  );
};

export default EditorWrapper;
