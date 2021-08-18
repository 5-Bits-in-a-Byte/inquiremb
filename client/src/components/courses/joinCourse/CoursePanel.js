import React, { useState } from "react";
import styled, { css } from "styled-components";

const CoursePanel = ({
  courseId,
  courseName,
  instructorName,
  selectedCourse,
  ...props
}) => {
  let displayBorder = false;
  if (selectedCourse == courseId) {
    displayBorder = true;
  }
  return (
    <CoursePanelWrapper displayBorder={displayBorder}>
      <Descriptor>Course:&nbsp;</Descriptor>
      <TextContent>{courseName}</TextContent>
      <div style={{ flex: 1 }}></div>
      <Descriptor>Instructor:&nbsp;</Descriptor>
      <TextContent>{instructorName}</TextContent>
    </CoursePanelWrapper>
  );
};

export default CoursePanel;

const CoursePanelWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 0.5rem 0;
  background-color: white;
  border: 2px solid
    ${(props) => (props.displayBorder ? css`#4CAF50` : css`none`)};
  border-radius: 0.2rem;
`;

const TextContent = styled.div`
  font-weight: 400;
  font-style: normal;
`;

const Descriptor = styled.div`
  opacity: 70%;
`;
