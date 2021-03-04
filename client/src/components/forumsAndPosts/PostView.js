import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Options from "./Options";
import Post from "./Post";
import Button from "../common/Button";
import LineWidthImg from "../../imgs/line-width.svg";
import HollowPinImg from "../../imgs/pin-hollow.svg";
import { useParams } from "react-router-dom";
import axios from "axios";

const testTitle = "This is temp post title text?";
const testContent =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis labore saepe voluptatem natus officia molestiae beatae repudiandae nisi. Aspernatur dolores sequi ipsum quaerat facilis.";
const testName = "Seth Tal";

const PostView = (props) => {
  const [isCondensed, setCondensedState] = useState(true);
  // Retrieves the courseid from the url parameters
  const { courseid } = useParams();

  // THIS IS WHERE WE WOULD RETRIEVE POSTS
  // useEffect(() => {
  //   axios.get(process.env.REACT_APP_SERVER_URL + "/api/")
  // }, [courseid]);

  return (
    <>
      <PostFeed>
        <ScrollingDiv>
          {/* TODOs as the week goes on...
            > TODO: Properly implement Post Groupings
            > TODO: add special secondary buttons to grouping header */}

          {/* Here we have a component that is literally a form, but asthetically its like a post */}
          {/* It only displays on the webpage when the user preses the new post button. */}

          <SortingOptions>
            <Button
              secondary={true}
              onClick={() => {
                setCondensedState(!isCondensed);
              }}
            >
              <img src={LineWidthImg} />
            </Button>
            <Button secondary={true} style={MarginLeftRight}>
              {" Most Recent "}
            </Button>
          </SortingOptions>
          <PostGroupingHeader>
            {" "}
            <img
              src={HollowPinImg}
              style={{ width: "18px", height: "18px" }}
            />{" "}
            Pinned Posts
          </PostGroupingHeader>

          <Post
            postTitle={testTitle}
            postContent={testContent}
            posterName={testName}
            isPinned={true}
            isCondensed={isCondensed}
          />
          <PostGroupingHeader>This Week</PostGroupingHeader>

          <Post
            postTitle={testTitle}
            postContent={testContent}
            posterName={testName}
            isPinned={false}
            isCondensed={isCondensed}
          />
          <Post
            postTitle={testTitle}
            postContent={testContent}
            posterName={testName}
            isPinned={false}
            isCondensed={isCondensed}
          />
          <Post
            postTitle={testTitle}
            postContent={testContent}
            posterName={testName}
            isPinned={false}
            isCondensed={isCondensed}
          />
          <Post
            postTitle={testTitle}
            postContent={testContent}
            posterName={testName}
            isPinned={false}
            isCondensed={isCondensed}
          />
          <Post
            postTitle={testTitle}
            postContent={testContent}
            posterName={testName}
            isPinned={false}
            isCondensed={isCondensed}
          />
          <Post
            postTitle={testTitle}
            postContent={testContent}
            posterName={testName}
            isPinned={false}
            isCondensed={isCondensed}
          />
          <Post
            postTitle={testTitle}
            postContent={testContent}
            posterName={testName}
            isPinned={false}
            isCondensed={isCondensed}
          />
        </ScrollingDiv>
      </PostFeed>

      {/* Displays options panel on the right of the webpage */}
      <Options />
    </>
  );
};

PostView.propTypes = {};

export default PostView;

const MarginLeftRight = {
  marginLeft: "1em",
  marginRight: "1em",
};

//#region PostView Styling
// const PostViewWrapper = styled.div`
//   overflow: scroll;
//   display: flex;
//   flex-direction: row;

//   width: 100%;

//   /* width */
//   ::-webkit-scrollbar {
//     width: 5px;
//   }

//   /* Track */
//   ::-webkit-scrollbar-track {
//     background: #f1f1f1;
//     visibility: hidden;
//   }

//   /* Handle */
//   ::-webkit-scrollbar-thumb {
//     background: #c4c4c4;
//     border-radius: 1em;
//   }

//   /* Handle on hover */
//   ::-webkit-scrollbar-thumb:hover {
//     background: #a4a4a4;
//   }
// `;

const PostFeed = styled.div`
  /* overflow: scroll; */
  /* display: flex;
  flex-direction: column;
  align-items: center;
  // border: 1px solid orange;
  flex-grow: 1; */
  max-width: 900px;
  width: 100%;
  position: relative;
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

const SortingOptions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  width: 100%;
  margin: 2.2em 0 1em 0;
`;

const PostGroupingHeader = styled.div`
  margin: 1em 0;

  font-family: Roboto;
  font-size: 1.25em;
  font-weight: 500;
`;
//#endregion
