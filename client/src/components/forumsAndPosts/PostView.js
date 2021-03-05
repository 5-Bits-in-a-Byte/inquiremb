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
import Fetch from "../common/requests/Fetch";

const createPost = (post) => {
  return (
    <Post
      // key=
      postTitle={post.title}
      postContent={post.content}
      posterName={post.postedby.first + " " + post.postedby.last}
      isPinned={post.isPinned}
      isCondensed={false}
    />
  );
};

// Sorts the posts by pinned/date
const generateSections = (data) => {
  let posts = { pinned: [], other: [] };
  if (data) {
    data.forEach((post) => {
      if (post.isPinned) {
        posts.pinned.push(createPost(post));
      } else {
        posts.other.push(createPost(post));
      }
    });
  }
  return posts;
};

const PostView = (props) => {
  const [isCondensed, setCondensedState] = useState(true);
  // Retrieves the courseid from the url parameters
  const { courseid } = useParams();
  const { data, errors, loading } = Fetch({
    type: "get",
    endpoint: "/api/courses/" + courseid + "/posts",
  });
  let posts = generateSections(data);

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
          {posts.pinned.length > 0 && (
            <PostGroupingHeader>
              <img
                src={HollowPinImg}
                style={{ width: 18, height: 18, marginRight: 5 }}
              />
              Pinned Posts
            </PostGroupingHeader>
          )}
          {posts.pinned}
          {posts.other.length > 0 && (
            <PostGroupingHeader>Other Posts</PostGroupingHeader>
          )}
          {posts.other}
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
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-right: 65px;
  width: 100%;
  margin: 2.2em 0 1em 0;
`;

const PostGroupingHeader = styled.div`
  margin: 2.2em 0 0em 0;
  font-size: 1.25em;
  font-weight: 500;
`;
//#endregion
