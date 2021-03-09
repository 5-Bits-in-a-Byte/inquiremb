import React, { useState } from "react";
import styled from "styled-components";
import RecentGroup from "./RecentGroup";
import Fetch from "../common/requests/Fetch";
import Post from "../posts/Post";

// Create the post using the Post component
const createPost = (post) => {
  return <Post post={post} key={post._id} isCondensed={false} />;
};

// Create a group of posts with the RecentGroup component
const createGroup = (postList, classroomName, nameColor) => {
  return (
    <RecentGroup
      postList={postList}
      classroomName={classroomName}
      nameColor={nameColor}
    />
  );
};

// Sorts the posts by most recent and groups them into their specific classes
const generateSections = (data) => {
  let groups = [];

  if (data) {
    // Initialize classes object
    let classes = { class: [], color: [] };

    // Populate classes object with class names and colors
    data.forEach((post) => {
      if (!classes.class.includes(post.course_name)) {
        classes.class.push(post.course_name);
        classes.color.push(post.color);
      }
    });

    // Initialize Post Grouping dictionary
    let postG = {};

    // Initialize empty list for each course
    classes.class.forEach((className) => {
      postG[className] = [];
    });

    // Place posts in the Post Grouping dictionary
    data.forEach((post) => {
      if (post.course_name in postG) {
        postG[post.course_name].push(createPost(post));
      }
    });

    // Build the class groups
    for (let i = 0; i < classes.class.length; i++) {
      if (!groups.includes(classes.class[i])) {
        groups.push(
          createGroup(
            postG[classes.class[i]],
            classes.class[i],
            classes.color[i]
          )
        );
      }
    }
  }
  return groups;
};

const Home = () => {
  let endpoint = "/api/home";

  // Load posts from course
  const { data, errors, loading } = Fetch({
    type: "get",
    endpoint: endpoint,
  });
  let groups = generateSections(data.posts);

  return (
    <Wrapper>
      <ViewWrapper>
        <ScrollingDiv>
          <MaxWidth>
            <h1 align="center" style={{ margin: "1em" }}>
              Recent Posts
            </h1>
            {groups}
          </MaxWidth>
        </ScrollingDiv>
      </ViewWrapper>
    </Wrapper>
  );
};

export default Home;

const Wrapper = styled.div`
  display: flex;
  /* flex-direction: column;
  justify-content: center;
  align-items: center; */
  height: 100%;
`;

const ViewWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ScrollingDiv = styled.div`
  height: 100%;
  width: 100%;
  padding: 0 280px 0 200px;
  overflow: auto;
  padding-right: 280px;
`;

const MaxWidth = styled.div`
  max-width: 900px;
  margin: auto;
  padding-bottom: 40px;
`;
