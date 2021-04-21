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
const createGroup = (postList, classroomName, nameColor, groupKey) => {
  return (
    <RecentGroup
      postList={postList}
      classroomName={classroomName}
      nameColor={nameColor}
      key={groupKey}
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
      if (!classes.class.includes(post.courseName)) {
        classes.class.push(post.courseName);
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
      if (post.courseName in postG) {
        postG[post.courseName].push(createPost(post));
      }
    });

    // Build the class groups
    for (let i = 0; i < classes.class.length; i++) {
      if (!groups.includes(classes.class[i])) {
        groups.push(
          createGroup(
            postG[classes.class[i]],
            classes.class[i],
            classes.color[i],
            i //The counter maps to the key of the react elements
          )
        );
      }
    }
  }

  return groups;
};

/** Home Component
 * @brief The entire home page showcasing recent posts in user courses.
 * @returns Home Component
 */
const Home = () => {
  let endpoint = "/api/home";

  // Load posts from course
  const { data, errors, loading } = Fetch({
    type: "get",
    endpoint: endpoint,
  });
  // console.log("Data: ", data);

  let groups =
    data != null && data.length == 0 ? (
      <h2 align="center">
        You have not yet joined or created a course, or there are no posts in
        any of your courses yet.
      </h2>
    ) : (
      generateSections(data)
    );

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
  display: absolute;
  height: calc(100vh - 66px);
  overflow-y: auto;
`;

const ViewWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ScrollingDiv = styled.div`
  height: 100%;
  width: 100%;
  padding: 0 280px 0 200px;
  padding-right: 280px;
`;

const MaxWidth = styled.div`
  max-width: 900px;
  margin: auto;
  padding-bottom: 40px;
`;
