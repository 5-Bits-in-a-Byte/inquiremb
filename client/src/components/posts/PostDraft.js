import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import DraftTextArea from "../common/DraftTextArea";
import Checkbox from "../common/Checkbox";
import Button from "../common/Button";
import LazyFetch from "../common/requests/LazyFetch";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useHistory } from "react-router";
import axios from "axios";
import MaterialCheckbox from "../common/MaterialCheckbox";

const accentColor = (type) => {
  switch (type) {
    case "Question":
      return "#4a86fa";
    case "Announcement":
      return "#FA6A4A";
    case "General":
      return "#EDEDED";
    default:
      return "#E7E7E7";
  }
};

const PostDraft = ({ userRole }) => {
  const { courseId } = useParams();
  const history = useHistory();
  // State and handlers for drafting posts
  const [isPrivate, toggleIsPrivate] = useState(false);
  const [isAnonymous, toggleIsAnonymous] = useState(false);
  const [title, setTitle] = useState("");

  var defaultType;
  if (userRole.publish.general) {
    defaultType = "General";
  } else if (userRole.publish.question) {
    defaultType = "Question";
  } else if (userRole.publish.announcement) {
    defaultType = "Announcement";
  } else {
    // This should never happen
    defaultType = "Unknown";
  }
  const [content, setContent] = useState({
    type: defaultType,
    raw: EditorState.createEmpty(),
    plainText: EditorState.createEmpty(),
  });

  const handleContentChange = (e) => {
    const plainText = e.getCurrentContent().getPlainText();
    setContent({ ...content, raw: e, plainText: plainText });
  };

  const handleSubmit = () => {
    const newContent = {
      ...content,
      type: content.type.toLowerCase(),
      raw: convertToRaw(content.raw.getCurrentContent()),
    };
    LazyFetch({
      type: "post",
      endpoint: "/courses/" + courseId + "/posts",
      data: {
        title: title,
        isAnonymous: isAnonymous,
        isPrivate: isPrivate,
        content: newContent,
      },
      onSuccess: (data) => {
        /* data.new is used after the redirect to prevent 
        a request for comments (new posts have 0 comments)*/
        data.new = true;
        history.push({
          pathname: "/course/" + data.courseId + "/post/" + data._id,
          state: { post: data },
        });
      },
    });
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

  // Styling Variables
  var titlePlaceholder =
    content.type != "Unknown" ? content.type + " title" : "Post title";
  var displayQuestion;
  var displayAnnouncement;
  var displayGeneral;
  if (userRole) {
    displayQuestion = userRole.publish.question;
    displayAnnouncement = userRole.publish.announcement;
    displayGeneral = userRole.publish.general;
  }
  var accent = accentColor(content.type);

  return (
    <Wrapper sideBarColor={accent}>
      <HeaderContentWrapper>
        {displayGeneral && (
          <PostFlag
            onClick={() => {
              setContent({ ...content, type: "General" });
            }}
            accentColor={accent}
            selected={content.type === "General"}
            isGeneral={userRole.publish.general}
          >
            General
          </PostFlag>
        )}
        {displayQuestion && (
          <PostFlag
            onClick={() => {
              setContent({ ...content, type: "Question" });
            }}
            accentColor={accent}
            selected={content.type === "Question"}
          >
            Question
          </PostFlag>
        )}
        {displayAnnouncement && (
          <PostFlag
            onClick={() => {
              setContent({ ...content, type: "Announcement" });
            }}
            accentColor={accent}
            selected={content.type === "Announcement"}
          >
            Announcement
          </PostFlag>
        )}
      </HeaderContentWrapper>
      <DraftTextArea
        minRows={1}
        placeholder={titlePlaceholder}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        name="title"
      />
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
            "image",
          ],
          image: {
            uploadCallback: imageCallback,
            uploadEnabled: true,
            previewImage: true,
            defaultSize: { width: "750" },
          },
        }}
      />
      <HRSeperator />
      <FooterContentWrapper>
        <ButtonSection>
          {userRole && userRole.privacy.anonymous ? (
            <MaterialCheckbox
              label={"Make Anonymous"}
              checkedState={{
                checked: isAnonymous,
                toggleChecked: toggleIsAnonymous,
              }}
            />
          ) : (
            <></>
          )}
          <MaterialCheckbox
            label={"Make Private"}
            checkedState={{
              checked: isPrivate,
              toggleChecked: toggleIsPrivate,
            }}
          />
          <Button primary onClick={handleSubmit} style={{ margin: "0 1em" }}>
            Submit
          </Button>
        </ButtonSection>
      </FooterContentWrapper>
    </Wrapper>
  );
};

export default PostDraft;

const Wrapper = styled.div`
  margin: 2em;
  padding: 0.5em;
  /* width: 719px; */
  /* max-width: 900px; */
  /* min-height: 255px; */
  /* height: 255px; */

  background-color: #fff;
  /* border: 1px solid red; */
  border-left: ${(props) =>
    props.sideBarColor
      ? "5px solid " + props.sideBarColor
      : "5px solid #e7e7e7"};
  border-radius: 5px;
  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;
//#region
const HeaderContentWrapper = styled.div`
  display: flex;
  align-items: center;

  padding: 5px;
  height: 40px;

  /* border: 1px solid #4a86fa; */
`;

const CircleIcon = styled.div`
  padding: 5px;
  width: 10px;
  height: 10px;

  background-color: ${(props) =>
    props.accentColor ? props.accentColor : "#e7e7e7"};

  border-radius: 50%;
`;

const PostFlag = styled.div`
  margin: 4px;
  padding: 2px 5px;
  color: ${(props) => (props.selected ? "#ededed  " : "#162B55")};
  background-color: ${(props) =>
    props.selected
      ? props.isGeneral
        ? "#565656"
        : props.accentColor
      : "#e7e7e7"};
  border-radius: 2px;
`;

const HRSeperator = styled.hr`
  margin: 5px 0;
  padding: 0 0 0 0;
  border: 1px solid #e7e7e7;
  border-radius: 5px;
`;

const FooterContentWrapper = styled.div`
  display: flex;
  align-items: center;

  /* padding: 5px; */
  height: 50px;

  /* border: 1px solid orange; */
`;

const ButtonSection = styled.div`
  display: inline-flex;
  margin-left: auto;
  height: 100%;
  align-items: center;
`;
