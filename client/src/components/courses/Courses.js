import React from "react";
import styled from "styled-components";
import TopContent from "./TopContent";
import CourseCard from "./CourseCard";

// Temporary hardcoded courses array and term
var coursesArray = [
  "MTH 342",
  "CIS 422",
  "CIS 473",
  "PSY 201",
  "SOC 104",
  "MTH 101",
  "ART 258",
];
var colorsArray = [
  "#000700",
  "#440000",
  "#500F90",
  "#FF0000",
  "#0F9900",
  "#000EEE",
  "#326500",
];
var currentTerm = "Winter 2021";

// List-to-components mapping technique from:
// https://reactjs.org/docs/lists-and-keys.html#basic-list-component
const courseList = coursesArray.map((course, index) => (
  <CourseCard
    key={course}
    courseName={course}
    courseTerm={currentTerm}
    color={colorsArray[index]}
  />
));

const Courses = () => {
  return (
    <ScrollDiv>
      <TopContent />
      <CourseDisplay className="content">{courseList}</CourseDisplay>
    </ScrollDiv>
  );
};

export default Courses;

const ScrollDiv = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
`;

const CourseDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 1em 1em 1em 1em;
  padding: 0;
  //transition: 150ms ease-in-out;
`;
