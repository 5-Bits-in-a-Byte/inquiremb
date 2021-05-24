import React, { useState, useEffect, useContext, useParams } from "react";
import styled, { css } from "styled-components";
import Options from "../Options";
import OptionsPanel from "./OptionsPanel";
import PostWrapper from "./PostWrapper";
import Poll from "react-polls";
import PollConfig from "./PollConfig";
import Button from "../../common/Button";
import LineWidthImg from "../../../imgs/line-width.svg";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState } from "draft-js";

const pollAnswers = [
  { option: "Yes", votes: 8 },
  { option: "No", votes: 2 },
];

const createPost = (postType, postData, userRole) => {
  return <PostWrapper postType={postType} />;
};

const PostRefactor = ({ userRole, highlightedSection, ...props }) => {
  const [pollAns, setPollAns] = useState(pollAnswers);
  const [condensed, setCondensed] = useState(false);

  const [content, setContent] = useState({
    type: "Question",
    raw: EditorState.createEmpty(),
    plainText: EditorState.createEmpty(),
  });

  const handleContentChange = (e) => {
    const plainText = e.getCurrentContent().getPlainText();
    setContent({ ...content, raw: e, plainText: plainText });
    console.log(content);
  };

  const handleVote = (voteAnswer) => {
    var pa = pollAns;
    const newPollAnswers = pa.map((answer) => {
      if (answer.option === voteAnswer) answer.votes++;
      return answer;
    });
    setPollAns(newPollAnswers);
  };

  var testAnonymousPostObject = {
    _id: "987654321",
    postedBy: {
      firstName: "Anonymous",
      lastName: "",
      isAnonymous: true,
      _id: "608dd55e87f76c3cdbf52745",
    },
    comments: 11,
    reactions: { likes: [], goods: [], helpfuls: [] },
    isInstructor: true,
  };
  var testPostObject = {
    _id: "123456789",
    postedBy: {
      firstName: "Brian",
      lastName: "Gunnarson",
      picture:
        "https://lh3.googleusercontent.com/a-/AOh14Ggopr1ZffPC5y-S8yZzvlkTYZanP0iDYBg0JnKU2Q=s96-c",
      isAnonymous: false,
      _id: "108734863236913803139",
    },
    comments: 7,
    reactions: { likes: ["108734863236913803139"], goods: [], helpfuls: [] },
    isInstructor: false,
  };

  var pollDraftDemo = {
    _id: "000111222",
    postedBy: {
      firstName: "Aaron",
      lastName: "Van Cleave",
      picture: "https://avatars.githubusercontent.com/u/46456517?v=4",
      isAnonymous: false,
      _id: "108734863236913803139",
    },
    comments: 0,
    reactions: { likes: ["108734863236913803139"], goods: [], helpfuls: [] },
    isInstructor: false,
  };

  return (
    <>
      <FlexWrapper id={"FlexWrapper"}>
        <Wrapper id={"PostRefactorWrapper"}>
          <PostFeedWrapper id={"PostFeedWrapper"}>
            <CenterWrapper id={"CenterWrapper"}>
              <SortingOptions id={"SortingOptions"}>
                <Button
                  secondary={true}
                  onClick={() => {
                    // setCondensedState(!isCondensed);
                    setCondensed(!condensed);
                  }}
                >
                  <img src={LineWidthImg} />
                </Button>
                <Button
                  secondary={true}
                  style={{
                    marginLeft: "1em",
                    marginRight: "1em",
                  }}
                  onClick={() => {
                    alert("This feature is a work in progress.");
                  }}
                >
                  {"Most Recent"}
                </Button>
              </SortingOptions>
              {/* {false ? createPost("Question") : TestPosts} */}
            </CenterWrapper>
          </PostFeedWrapper>
          <OptionsPanel userRole={false} />
        </Wrapper>
        <OverflowCounter offsetAmount={"2.5rem"} />
      </FlexWrapper>
    </>
  );
};

export default PostRefactor;

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100vh;

  /* border: 1px solid orange; */
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 100%;
  height: 100%;
  overflow: auto;

  /* border: 1px solid green; */
`;

/** THIS ACCOUNTS FOR WEIRD SCROLLING DIV STUFF */
const OverflowCounter = styled.div`
  width: 100%;
  ${(props) =>
    props.offsetAmount &&
    css`
      padding: ${props.offsetAmount};
    `}/* border: 3px solid black; */
`;

const PostFeedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1rem;
  /* border: 1px solid green; */
`;

const CenterWrapper = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  /* padding-left: 10rem; */
  /* position: relative; */
`;

const SortingOptions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin: 1.5em 0 1em 0;
  /* position: absolute; */
  padding-right: 0em;
`;
