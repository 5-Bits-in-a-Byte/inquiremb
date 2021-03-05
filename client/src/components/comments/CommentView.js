import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Post from "../forumsAndPosts/Post";
import Sidebar from "../forumsAndPosts/Sidebar";
import Button from "../common/Button";
import Comment from "./Comment";
import { useParams } from "react-router-dom";

const testTitle = "This is temp post title text?";
const testContent =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At repudiandae nam, illo perferendis veniam earum fugit rerum temporibus laboriosam aut veritatis amet adipisci nulla!";
const testName = "Seth Tal";

const CommentView = ({ classroomName }) => {
  const { courseid, postid } = useParams();
  console.log(courseid, postid);
  return (
    <CommentViewWrapper>
      <Sidebar
        classroomName={classroomName}
        setHighlightedSection={() => {}}
        highlightedSection={""}
      />

      <CommentViewContainer>
        <ScrollingDiv>
          <OptionsContainer>
            <Button>Back to all Posts</Button>
            <Button>Reply to Post</Button>
          </OptionsContainer>
          <Post
            postTitle={testTitle}
            postContent={testContent}
            posterName={testName}
            isPinned={true}
            isCondensed={false}
          />
          <Comment posterName={testName} commentContent={testContent} />
        </ScrollingDiv>
      </CommentViewContainer>
      <EmptyDiv />
    </CommentViewWrapper>
  );
};

CommentView.propTypes = {};

export default CommentView;

const CommentViewWrapper = styled.div`
  display: flex;
  height: 100%;
`;

const CommentViewContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 900px;
  width: 100%;
  /* border: 1px solid green; */
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: 2.2em 0 1.1em 0;
`;

const EmptyDiv = styled.div`
  width: 280px; // Need to make same width as nav + menu bar
  flex-grow: 1;
`;

const PostCommentContainer = styled.div`
  width: 100%;

  /* border: 1px solid orange; */
`;

const ScrollingDiv = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  padding: 0 40px;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
  }
`;
