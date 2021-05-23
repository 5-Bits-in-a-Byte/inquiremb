import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import LazyFetch from "../../common/requests/LazyFetch";
import { useParams } from "react-router";

const convertToUpper = (postType) => {
  var first = postType[0].toUpperCase();
  var rest = postType.slice(1);
  return first + rest;
};

const EditorWrapper = ({ post, edit }) => {
  const { courseId } = useParams();
  const [editorStateTest, setEditorStateTest] = useState(
    EditorState.createWithContent(convertFromRaw(post.content.raw))
  );

  const [plainText, setPlainText] = useState(post.content.plainText);

  const handleContentChange = (e) => {
    setEditorStateTest(e);
    setPlainText(e.getCurrentContent().getPlainText());
  };

  const handleSubmit = () => {
    LazyFetch({
      type: "put",
      endpoint: "/api/courses/" + courseId + "/posts",
      data: {
        content: {
          type: post.content.type,
          raw: convertToRaw(editorStateTest.getCurrentContent()),
          plainText: plainText,
        },
        title: post.title,
        isPinned: post.isPinned,
        _id: post._id,
      },
      onSuccess: (data) => {
        console.log(data);
      },
      onFailure: (err) => {
        console.log(err);
      },
    });
  };

  return (
    <>
      {edit ? (
        <Editor
          name="content"
          editorState={editorStateTest}
          editorStyle={{
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
          editorStyle={{
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
        />
      )}
    </>
  );
};

export default EditorWrapper;
