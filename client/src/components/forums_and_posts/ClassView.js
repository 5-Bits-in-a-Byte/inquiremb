import React from "react";
import PropTypes from "prop-types"
import styled from "styled-components";
import SectionTab from "./SectionTab";
import Post from "./Post"
import OptionsButton from "./OptionsButton"

const ClassView = (props) => {
  return (
    <ClassViewWrapper>
      {/* Sidebar view shows tabs of different post feeds and shows which one is selected */}
      <Sidebar>
        <ClassTitle>{props.classroomName}</ClassTitle>

        <hr style={InlineHRStyle}/>

        <ClassSection>
          <SectionTab selectedTab={true} tabText={"All Posts"} imageLocation={"./icons8_note.svg"} />
          <SectionTab selectedTab={false} tabText={"Instructor"} imageLocation={"./icons8_glasses 1.svg"} />
        </ClassSection>

        <ClassSubtitle>My Posts</ClassSubtitle>

        <UserSection>
          <SectionTab selectedTab={false} tabText={"My Posts"} imageLocation={"./icons8_user_2 1.svg"} />
          <SectionTab selectedTab={false} tabText={"My Upvoted"} imageLocation={"./icons8_heart 1.svg"} />
          <SectionTab selectedTab={false} tabText={"Bookmarked"} imageLocation={"./icons8_bookmark 1.svg"} />
        </UserSection>
      </Sidebar>
      
      {/* View of current Post Feed - 
          TODO: should populate based on selected tab */}
      <PostView>
        <PostFeed>

          {/* TODOs as the week goes on...
              > TODO: Properly implement Post Groupings
              > TODO: add special secondary buttons to grouping header */}

          <PostGrouping>
            <PostGroupingHeader>Pinned Posts</PostGroupingHeader>
            <Post postTitle={testTitle} postContent={testContent} posterName={testName} isPinned={true} />
          </PostGrouping>
          <PostGrouping>
            <PostGroupingHeader>This Week</PostGroupingHeader>
            <Post postTitle={testTitle} postContent={testContent} posterName={testName} isPinned={false} />
            <Post postTitle={testTitle} postContent={testContent} posterName={testName} isPinned={false} />
          </PostGrouping>
        </PostFeed>

        {/* Displays options panel on the right of the webpage */}
        <OptionsWrapper>
          <OptionsHeader>OPTIONS</OptionsHeader>
          <OptionsPanel>
            <OptionsButton buttonText={"+ New Post"} isPrimary={true} />
            <OptionsButton buttonText={"Message Instructor"} isPrimary={false} />
            <OptionsButton buttonText={"Do a thing"} isPrimary={false} />
            <OptionsButton buttonText={"Do another thing"} isPrimary={false} />
          </OptionsPanel>
        </OptionsWrapper>
      </PostView>
    </ClassViewWrapper>
  );
}

SectionTab.propTypes = {
  ClassroomName: PropTypes.string
}

export default ClassView;

const testTitle = "This is temp post title text?";
const testContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At repudiandae nam, illo perferendis veniam earum fugit rerum temporibus laboriosam aut veritatis amet adipisci nulla!";
const testName = "Seth Tal";

const ClassViewWrapper = styled.div`
  display: flex;
`;

// #region Sidebar Stylings
const InlineHRStyle = {
  width : "80%",
  border: "1px solid #DDDDDD"
}

const Sidebar = styled.div`
  width: 200px;
  height: calc(100vh - 55px);

  box-shadow: 5px 2px 6px -2px rgba(0, 0, 0, 0.15);
`;

const ClassTitle = styled.h1`
  height: 2em;

  line-height: 2.5em;
  font-size: 1.5rem;
  text-align: center;

  user-select: none;
`;

const ClassSubtitle = styled.h2`
  height: 2em;
  margin-left: 1.5em;

  line-height: 2.5em;
  font-size: 1.25rem;
  text-align: left;

  color: #B8B8B8;

  user-select: none;
`;

const ClassSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
// #endregion

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
