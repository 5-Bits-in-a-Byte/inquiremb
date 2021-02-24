import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import SectionTab from "./SectionTab";
import Post from "./Post";
import OptionsButton from "./OptionsButton";
import Sidebar from "./Sidebar";

const testTitle = "This is temp post title text?";
const testContent =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At repudiandae nam, illo perferendis veniam earum fugit rerum temporibus laboriosam aut veritatis amet adipisci nulla!";
const testName = "Seth Tal";

const ClassView = ({ classroomName }) => {
  const [section, selectSection] = useState("All Posts");
  console.log(section);
  return (
    <ClassViewWrapper>
      <Sidebar
        classroomName={classroomName}
        selectSection={selectSection}
        section={section}
      />

      {/* View of current Post Feed - 
          TODO: should populate based on selected tab */}
      <PostView>
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
        <OptionsWrapper>
          <OptionsHeader>OPTIONS</OptionsHeader>
          <OptionsPanel>
            <OptionsButton buttonText={"+ New Post"} isPrimary={true} />
            <OptionsButton
              buttonText={"Message Instructor"}
              isPrimary={false}
            />
            <OptionsButton buttonText={"Do a thing"} isPrimary={false} />
            <OptionsButton buttonText={"Do another thing"} isPrimary={false} />
          </OptionsPanel>
        </OptionsWrapper>
      </PostView>
    </ClassViewWrapper>
  );
};

SectionTab.propTypes = {
  ClassroomName: PropTypes.string,
};

export default ClassView;

const ClassViewWrapper = styled.div`
  display: flex;
`;

//#region Post View Stylings
const PostView = styled.div`
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

//#region Options Stylings
const OptionsWrapper = styled.div`
  // border: 1px solid green;
  width: 25%;
`;

const OptionsHeader = styled.h1`
  margin: 3em 0 2em 0;

  font-size: 14px;
`;

const OptionsPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 220px;
  height: 240px;

  // border: 1px solid black;
  border-radius: 5px;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;
//#endregion
