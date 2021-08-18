import React from "react";
import styled, { css } from "styled-components";

const CoursePanel = ({
  courseId,
  courseName,
  instructorName,
  selectedCourse,
  setSelectedCourse,
  ...props
}) => {
  let displayBorder = false;
  if (selectedCourse == courseId) {
    displayBorder = true;
  }

  const handleCourseSelect = () => {
    console.log("you pressed " + courseName + " with courseId: " + courseId);
    setSelectedCourse(courseId);
  };

  return (
    <CoursePanelWrapper
      displayBorder={displayBorder}
      onClick={handleCourseSelect}
    >
      <Descriptor>Course:&nbsp;</Descriptor>
      <TextContent>{courseName}</TextContent>
      <div style={{ flex: 1 }}></div>
      <Descriptor>Instructor:&nbsp;</Descriptor>
      <TextContent>{instructorName}</TextContent>
    </CoursePanelWrapper>
  );
};

export default CoursePanel;

const CoursePanelWrapper = styled.button`
  display: flex;
  justify-content: space-evenly;
  margin: 0.5rem 0;
  background-color: white;
  border: none;
  cursor: pointer;
  ${(props) =>
    props.displayBorder &&
    css`
      border: 2px solid #4caf50;
    `}
  border-radius: 0.2rem;
`;

const TextContent = styled.div`
  font-weight: 400;
  font-style: normal;
`;

const Descriptor = styled.div`
  opacity: 70%;
`;
