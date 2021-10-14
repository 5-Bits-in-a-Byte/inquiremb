import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import SectionTab from "./SectionTab";
import UserImg from "../../../imgs/user.svg";
import { UserContext } from "../../context/UserProvider";
import GlassesImg from "../../../imgs/glasses.svg";
import NoteImg from "../../../imgs/note.svg";
import HeartImg from "../../../imgs/heart.svg";
import AnnouncementsImg from "../../../imgs/announcements.svg";
import QuestionsImg from "../../../imgs/questions.svg";
import PollsImg from "../../../imgs/polls.svg";
import GeneralImg from "../../../imgs/general.svg";
import { ColorContext } from "../../context/ColorModeContext";

/* Sidebar view shows tabs of different post feeds and shows which one is selected */
const Sidebar = ({ userRole, setHighlightedSection, highlightedSection }) => {
  const { courseId, postid } = useParams();
  const theme = useContext(ColorContext);

  // Extracting the course name from the user context and current course ID
  var classroomID = useParams().courseId;
  var courseContext = useContext(UserContext).courses;
  var classroomName = " ";

  for (let temp in courseContext) {
    if (courseContext[temp].courseId === classroomID) {
      classroomName = courseContext[temp].courseName;
      break;
    }
  }

  // If the name is longer than 18 characters, scale the font size down by this proportion
  var nameRatio = Math.min(1.0, 12 / classroomName.length);
  //var nameRatio = 1;

  return (
    <>
      <FlexWrapper>
        <Container theme={theme}>
          <Link to={"/course/" + courseId} style={{ textDecoration: "none" }}>
            <ClassTitle nameFit={nameRatio} theme={theme}>
              {classroomName}
            </ClassTitle>
          </Link>

          <HR />

          <ClassSubtitle>Course Filters</ClassSubtitle>

          <Section>
            <SectionTab
              tabText={"All Posts"}
              imageLocation={NoteImg}
              setHighlightedSection={setHighlightedSection}
              highlightedSection={highlightedSection}
            />
            <SectionTab
              tabText={"Instructor"}
              imageLocation={GlassesImg}
              setHighlightedSection={setHighlightedSection}
              highlightedSection={highlightedSection}
            />
            <SectionTab
              tabText={"Announcements"}
              imageLocation={AnnouncementsImg}
              setHighlightedSection={setHighlightedSection}
              highlightedSection={highlightedSection}
            />
            <SectionTab
              tabText={"Questions"}
              imageLocation={QuestionsImg}
              setHighlightedSection={setHighlightedSection}
              highlightedSection={highlightedSection}
            />
            <SectionTab
              tabText={"General Posts"}
              imageLocation={GeneralImg}
              setHighlightedSection={setHighlightedSection}
              highlightedSection={highlightedSection}
            />
            <SectionTab
              tabText={"Polls"}
              imageLocation={PollsImg}
              setHighlightedSection={setHighlightedSection}
              highlightedSection={highlightedSection}
            />
          </Section>

          <ClassSubtitle>My Filters</ClassSubtitle>

          <Section>
            <SectionTab
              tabText={"My Posts"}
              imageLocation={UserImg}
              setHighlightedSection={setHighlightedSection}
              highlightedSection={highlightedSection}
            />
            <SectionTab
              tabText={"My Upvoted"}
              imageLocation={HeartImg}
              setHighlightedSection={setHighlightedSection}
              highlightedSection={highlightedSection}
            />
          </Section>
        </Container>
      </FlexWrapper>
    </>
  );
};

export default Sidebar;

// #region Sidebar Stylings
const HR = styled.hr`
  width: 80%;
  border: 1px solid #dddddd;
`;

const FlexWrapper = styled.div`
  flex: 0 0 200px;
  transition: 150ms ease-out;
  @media only screen and (max-width: 1200px) {
    width: 0;
    overflow: hidden;
    flex: 0 0 0;
  }
`;

const Container = styled.div`
  height: calc(100vh - 55px);
  box-shadow: 5px 2px 6px -2px rgba(0, 0, 0, 0.15);
  background-color: ${(props) => props.theme.interiorPanel};
  max-width: 200px;
  transition: 150ms ease-out;
  @media only screen and (max-width: 1200px) {
    width: 0;
    overflow: hidden;
  }
`;

const ClassTitle = styled.h1`
  color: ${(props) => props.theme.logoFontColor};
  height: 2em;
  line-height: 2.5em;
  font-size: ${(props) => props.nameFit * 1.5}rem;
  text-align: center;
  user-select: none;
`;

const ClassSubtitle = styled.h2`
  height: 2em;
  margin-left: 1.5em;
  line-height: 2.5em;
  font-size: 1.25rem;
  text-align: left;
  color: #7e7e7e; // will find better grey later but for now this is for contrast
  user-select: none;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
