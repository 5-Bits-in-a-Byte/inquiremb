import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Options from "./Options";
import Post from "./Post";
import Button from "../common/Button";

const testTitle = "This is temp post title text?";
const testContent =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At repudiandae nam, illo perferendis veniam earum fugit rerum temporibus laboriosam aut veritatis amet adipisci nulla!";
const testName = "Seth Tal";

const PostView = (props) => {
  return (
    <PostViewWrapper>
      <PostFeed>
        {/* TODOs as the week goes on...
            > TODO: Properly implement Post Groupings
            > TODO: add special secondary buttons to grouping header */}

        <SortingOptions>
          <Button secondary={true}>
            <img src="./icons8_line_width_1.svg" />
          </Button>
          <Button secondary={true} style={MarginLeftRight}>
            {" Most Recent "}
          </Button>
        </SortingOptions>

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

PostView.propTypes = {};

export default PostView;

const MarginLeftRight = {
  marginLeft: "1em",
  marginRight: "1em",
};

//#region PostView Styling
const PostViewWrapper = styled.div`
  display: flex;
  flex-direction: row;

  width: 100%;
`;

const PostFeed = styled.div`
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  // border: 1px solid orange;
  width: 70%;
  height: 1025px;

  /* width */
  ::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    visibility: hidden;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #c4c4c4;
    border-radius: 1em;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #a4a4a4;
  }
`;

const SortingOptions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  width: 100%;
  margin: 2.2em 0 1em 0;
`;

const PostGrouping = styled.div`
  height: auto;
`;

const PostGroupingHeader = styled.div`
  margin: 1em 0;

  font-family: Roboto;
  font-size: 1.25em;
  font-weight: 500;
`;
//#endregion
