import React from "react";
import styled from "styled-components";
import SectionTab from "./SectionTab";

/* Sidebar view shows tabs of different post feeds and shows which one is selected */
const Sidebar = ({
  classroomName,
  setHighlightedSection,
  highlightedSection,
}) => {
  return (
    <FlexWrapper>
      <Container>
        <ClassTitle>{classroomName}</ClassTitle>

        <HR />
        <Section>
          <SectionTab
            tabText={"All Posts"}
            imageLocation={"./icons8_note.svg"}
            setHighlightedSection={setHighlightedSection}
            highlightedSection={highlightedSection}
          />
          <SectionTab
            tabText={"Instructor"}
            imageLocation={"./icons8_glasses 1.svg"}
            setHighlightedSection={setHighlightedSection}
            highlightedSection={highlightedSection}
          />
        </Section>

        <ClassSubtitle>My Posts</ClassSubtitle>

        <Section>
          <SectionTab
            tabText={"My Posts"}
            imageLocation={"./icons8_user_2 1.svg"}
            setHighlightedSection={setHighlightedSection}
            highlightedSection={highlightedSection}
          />
          <SectionTab
            tabText={"My Upvoted"}
            imageLocation={"./icons8_heart 1.svg"}
            setHighlightedSection={setHighlightedSection}
            highlightedSection={highlightedSection}
          />
          <SectionTab
            tabText={"Bookmarked"}
            imageLocation={"./icons8_bookmark 1.svg"}
            setHighlightedSection={setHighlightedSection}
            highlightedSection={highlightedSection}
          />
        </Section>
      </Container>
    </FlexWrapper>
  );
};

export default Sidebar;

// #region Sidebar Stylings
const HR = styled.hr`
  width: 80%;
  border: 1px solid #dddddd;
`;

const FlexWrapper = styled.div`
  flex: 1 0 200px;
`;

const Container = styled.div`
  height: calc(100vh - 55px);
  box-shadow: 5px 2px 6px -2px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  max-width: 200px;
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
  color: #b8b8b8;
  user-select: none;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
