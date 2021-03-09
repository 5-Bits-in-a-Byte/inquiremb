import React from "react";
import styled from "styled-components";
import RecentPost from "./RecentPost";
import RecentGroup from "./RecentGroup";

// Fetch ->
/**
 * returns {
    "postinfo"
    "coursename"
    "color"
}
 */

const testPosts = [<RecentPost />, <RecentPost />, <RecentPost />];

const testGroups = [
  <RecentGroup
    postList={testPosts}
    classroomName={"CIS 422"}
    nameColor={"red"}
  />,
  <RecentGroup
    postList={testPosts}
    classroomName={"CIS 471"}
    nameColor={"red"}
  />,
  <RecentGroup
    postList={testPosts}
    classroomName={"IDK 123"}
    nameColor={"red"}
  />,
  <RecentGroup
    postList={testPosts}
    classroomName={"IDK 456"}
    nameColor={"red"}
  />,
];

const Home = () => {
  return (
    <Wrapper>
      <ViewWrapper>
        <ScrollingDiv>
          <MaxWidth>{testGroups}</MaxWidth>
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

  border: 1px solid red;
`;

const ViewWrapper = styled.div`
  position: relative;
  width: 100%;

  border: 1px solid orange;
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
