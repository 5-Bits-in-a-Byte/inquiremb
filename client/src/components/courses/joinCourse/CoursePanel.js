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
    setSelectedCourse(courseId);
  };

  return (
    <CoursePanelWrapper
      displayBorder={displayBorder}
      onClick={handleCourseSelect}
      id={"wrapper"}
    >
      <Descriptor>Course:&nbsp;</Descriptor>
      <TextContent>{courseName}</TextContent>
      <Descriptor style={{ marginLeft: "auto" }}>Instructor:&nbsp;</Descriptor>
      <TextContent>{instructorName}</TextContent>
    </CoursePanelWrapper>
  );
};

export default CoursePanel;

const CoursePanelWrapper = styled.button`
  display: flex;
  margin: 0.5rem 0;
  background-color: white;
  border: none;
  width: 600px;
  height: 50px;
  cursor: pointer;
  padding: 0em 6em;
  ${(props) =>
    props.displayBorder &&
    css`
      border: 2px solid #4caf50;
    `}
  border-radius: 0.2rem;
`;

const TextContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-style: normal;
  height: 50px;
`;

const Descriptor = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 70%;
  height: 50px;
`;
