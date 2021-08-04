import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import DraftTextArea from "../../common/DraftTextArea";
import Checkbox from "../../common/Checkbox";
import Button from "../../common/Button";
import LazyFetch from "../../common/requests/LazyFetch";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useHistory } from "react-router";

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

const Draft = ({ userRole }) => {
  const { courseId } = useParams();
  const history = useHistory();
  // State and handler for drafting posts
  const [draft, setDraft] = useState({
    title: "",
    isAnonymous: false,
    isPrivate: false,
    uploadedImages: []
  });

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

  const handleChange = (e) => {
    setDraft({
      ...draft,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  const handleContentChange = (e) => {
    const plainText = e.getCurrentContent().getPlainText();
    setContent({ ...content, raw: e, plainText: plainText });
    console.log(content);
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
        title: draft.title,
        isAnonymous: draft.isAnonymous,
        isPrivate: draft.isPrivate,
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

  const imageCallback = (file) => {
    // Put LazyFetch first here
    let newImages = draft.uploadedImages;
    console.log("file:", file);
    const imageObject = {
      file: file,
      // LazyFetch sends URL I can store here
      link: URL.createObjectURL(file),
    }
    newImages.append(imageObject);
    setDraft({...draft, uploadedImages: newImages});

    return new Promise(
      (resolve, reject) => {
        resolve({ data: { link: imageObject.link } });
      }
    );
  }

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

  // console.log("User Role: ", userRole);

  return (
    <Wrapper sideBarColor={accent}>
      <HeaderContentWrapper>
        {displayGeneral && (
          <Button
            signin
            onClick={() => {
              setContent({ ...content, type: "General" });
            }}
            style={{ margin: "0 1em" }}
          >
            <PostFlag
              accentColor={accent}
              selected={content.type === "General"}
              isGeneral={userRole.publish.general}
            >
              General
            </PostFlag>
          </Button>
        )}
        {displayQuestion && (
          <Button
            signin
            onClick={() => {
              setContent({ ...content, type: "Question" });
            }}
            style={{ margin: "0 1em" }}
          >
            <PostFlag
              accentColor={accent}
              selected={content.type === "Question"}
            >
              Question
            </PostFlag>
          </Button>
        )}
        {displayAnnouncement && (
          <Button
            signin
            onClick={() => {
              setContent({ ...content, type: "Announcement" });
            }}
            style={{ margin: "0 1em" }}
          >
            <PostFlag
              accentColor={accent}
              selected={content.type === "Announcement"}
            >
              Announcement
            </PostFlag>
          </Button>
        )}
      </HeaderContentWrapper>
      <DraftTextArea
        minRows={1}
        placeholder={titlePlaceholder}
        onChange={handleChange}
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
          options: ["inline", "list", "link", "emoji", "history", "blockType", "image"],
          image: { uploadCallback: imageCallback, uploadEnabled: true }
        }}
      />
      <HRSeperator />
      <FooterContentWrapper>
        <ButtonSection>
          {userRole && userRole.privacy.anonymous ? (
            <Checkbox
              checkboxName="isAnonymous"
              labelText={"Make Anonymous"}
              onChange={handleChange}
              checkStatus={draft.isAnonymous}
            />
          ) : (
            <></>
          )}
          <Checkbox
            checkboxName="isPrivate"
            labelText={"Make Private"}
            onChange={handleChange}
            checkStatus={draft.isPrivate}
          />
          <Button primary onClick={handleSubmit} style={{ margin: "0 1em" }}>
            Submit
          </Button>
        </ButtonSection>
      </FooterContentWrapper>
    </Wrapper>
  );
};

export default Draft;

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
  /* margin-left: 1em; */
  padding: 2px 5px;
  color: ${(props) =>
    props.selected ? (props.isGeneral ? "#162B55" : "#ededed") : "#162B55"};
  background-color: ${(props) =>
    props.selected
      ? props.isGeneral
        ? "#e7e7e7"
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
