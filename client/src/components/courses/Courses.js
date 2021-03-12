import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserProvider";
import styled from "styled-components";
import TopContent from "./TopContent";
import CourseCard from "./CourseCard";

const generateCourseList = (userCourses) => {
  let ret = [];
  userCourses.forEach((course, index) => {
    ret.push(
      <CourseCard
        key={course.course_id}
        id={course.course_id}
        courseName={course.course_name}
        courseTerm="Winter 2021"
        color={course.color || "#121212"}
      />
    );
  });
  return ret;
};

const Courses = () => {
  const user = useContext(UserContext);
  let currentCourseState = generateCourseList(user.courses);
  const [courseList, setCourseList] = useState(currentCourseState);
  // console.log(currentCourseState);

  return (
    <ScrollDiv>
      <TopContent courseList={courseList} setCourseList={setCourseList} />
      <CourseDisplay className="content">{courseList}</CourseDisplay>
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
