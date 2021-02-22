import React from "react";
import styled from "styled-components";
import SectionTab from "./SectionTab";

const ClassView = (props) => {
  return (
    <Sidebar>
      <ClassTitle>CIS 422</ClassTitle>

      <hr style={InlineHRStyle}/>

      <ClassSection>
        <SectionTab setHighlight={true} tabText={"All Posts"} />
        <SectionTab setHighlight={false} tabText={"Instructor"} />
      </ClassSection>
      <ClassSubtitle>My Posts</ClassSubtitle>
      <UserSection>
        <SectionTab setHighlight={false} tabText={"My Posts"} />
        <SectionTab setHighlight={false} tabText={"My Upvoted"} />
        <SectionTab setHighlight={false} tabText={"Bookmarked"} />
      </UserSection>
    </Sidebar>
  );
}

export default ClassView;

const InlineHRStyle = {
  width : "80%",
  border: "1px solid #DDDDDD"
}

const Sidebar = styled.div`
  // border: 1px solid #000;
  width: 200px;
  height: calc(100vh - 55px);

  box-shadow: 5px 2px 6px -2px rgba(0, 0, 0, 0.15);
`;

const ClassTitle = styled.h1`
  // border: 3px solid blue;
  height: 2em;

  line-height: 2.5em;
  font-size: 1.5rem;
  text-align: center;
`;

const ClassSubtitle = styled.h2`
  height: 2em;
  margin-left: 1.5em;

  line-height: 2.5em;
  font-size: 1.25rem;
  text-align: left;

  color: #B8B8B8;
`;

const ClassSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  // border: 3px solid green;
  // height: 5em;
`;

const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  // border: 3px solid yellow;
`;
