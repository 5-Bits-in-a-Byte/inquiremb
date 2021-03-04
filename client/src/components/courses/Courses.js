import React, { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import styled from "styled-components";
import TopContent from "./TopContent";
import CourseCard from "./CourseCard";

const colorsArray = [
  "#000700",
  "#440000",
  "#500F90",
  "#FF0000",
  "#0F9900",
  "#000EEE",
  "#326500",
];

// List-to-components mapping technique from:
// https://reactjs.org/docs/lists-and-keys.html#basic-list-component
const courseList = (userCourses) => {
  let ret = [];
  userCourses.forEach((course, index) =>
    ret.push(
      <CourseCard
        key={course.course_id}
        courseName={course.course_name}
        courseTerm="Winter 2021"
        // to={"course-" + course.split(" ").join("") + "-path/landing-page"}
        to="/name"
        color={course.color || colorsArray[index]}
      />
    )
  );
  return ret;
};

const Courses = () => {
  const user = useContext(UserContext);
  return (
    <ScrollDiv>
      <TopContent />
      <CourseDisplay className="content">
        {courseList(user.courses)}
      </CourseDisplay>
    </ScrollDiv>
  );
};

export default Courses;

const ScrollDiv = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const CourseDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 1em 1em 1em 1em;
  padding: 0;
  //transition: 150ms ease-in-out;
`;
