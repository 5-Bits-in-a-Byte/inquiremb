import React from 'react';
import styled from "styled-components";
import PropTypes from 'prop-types';
import Options from './Options';
import Post from "./Post"

const testTitle = "This is temp post title text?";
const testContent =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At repudiandae nam, illo perferendis veniam earum fugit rerum temporibus laboriosam aut veritatis amet adipisci nulla!";
const testName = "Seth Tal";


const PostView = props => {
  return (
    <PostViewWrapper>
      <PostFeed>
        {/* TODOs as the week goes on...
            > TODO: Properly implement Post Groupings
            > TODO: add special secondary buttons to grouping header */}

        <PostGrouping>
          <PostGroupingHeader>Pinned Posts</PostGroupingHeader>
          <Post
            postTitle={testTitle}
            postContent={testContent}
            posterName={testName}
            isPinned={true}
          />
        </PostGrouping>
        <PostGrouping>
          <PostGroupingHeader>This Week</PostGroupingHeader>
          <Post
            postTitle={testTitle}
            postContent={testContent}
            posterName={testName}
            isPinned={false}
          />
          <Post
            postTitle={testTitle}
            postContent={testContent}
            posterName={testName}
            isPinned={false}
          />
        </PostGrouping>
      </PostFeed>

      {/* Displays options panel on the right of the webpage */}
      <Options />
    </PostViewWrapper>
  );
};

PostView.propTypes = {
    
};

export default PostView;

//#region PostView Styling
const PostViewWrapper = styled.div`
  overflow: scroll;

  display: flex;
  flex-direction: row;

  // border: 1px solid red;
  width: 100%;
`;

const PostFeed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  // border: 1px solid orange;
  width: 75%;
`;

const PostGrouping = styled.div`
  height: auto;

  // border: 1px solid black;
`;

const PostGroupingHeader = styled.div`
  margin: 1em 0;

  font-family: Roboto;
  font-size: 1.25em;
  font-weight: 500;
`;
//#endregion
