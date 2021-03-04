import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Post from "../forumsAndPosts/Post";
import Sidebar from "../forumsAndPosts/Sidebar";
import Button from "../common/Button";
import Comment from "./Comment";

const testTitle = "This is temp post title text?";
const testContent =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At repudiandae nam, illo perferendis veniam earum fugit rerum temporibus laboriosam aut veritatis amet adipisci nulla!";
const testName = "Seth Tal";

const CommentView = ({ classroomName }) => {
  return (
    <CommentViewWrapper>
      <Sidebar
        classroomName={classroomName}
        setHighlightedSection={() => {}}
        highlightedSection={""}
      />

      <CommentViewContainer>
        <OptionsContainer>
          <Button>Back to all Posts</Button>
          <Button>Reply to Post</Button>
        </OptionsContainer>

        <PostCommentContainer>
          <Post
            postTitle={testTitle}
            postContent={testContent}
            posterName={testName}
            isPinned={true}
            isCondensed={true}
          />
          <Comment posterName={testName} commentContent={testContent} />
        </PostCommentContainer>
      </CommentViewContainer>
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
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  border: 1px solid green;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;

  width: 100%;

  border: 1px solid blue;
`;

const PostCommentContainer = styled.div`
  width: 100%;

  border: 1px solid orange;
`;
