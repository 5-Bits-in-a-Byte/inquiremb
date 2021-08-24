import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserProvider";
import styled from "styled-components";
import TopContent from "./TopContent";
import CourseCard from "./CourseCard";

/** generateCourseList (list)
 * @brief Creates a list of CourseCards generated from the UserContext course list
 *
 * @param {list} userCourses the list of user courses from the UserContext
 * @returns a list of CourseCard components
 */
const generateCourseList = (userCourses) => {
  let ret = [];
  userCourses.forEach((course, index) => {
    ret.push(
      <CourseCard
        key={course.courseId}
        id={course.courseId}
        courseName={course.courseName}
        nickname={course.nickname}
        courseTerm="Winter 2021"
        color={course.color || "#121212"}
      />
    );
  });
  return ret;
};

/** Courses Component
 * @brief Contains the programmatically generated list of user course cards from the UserCourses list in the UserContext
 *
 * @returns Wrapper containing all generated user course components
 */
const Courses = () => {
  const user = useContext(UserContext);
  let currentCourseState = generateCourseList(user.courses);
  const [courseList, setCourseList] = useState(currentCourseState);

  return (
    <WrapAll>
      <ScrollDiv>
        <TopContent courseList={courseList} setCourseList={setCourseList} />
        <WrapDisplay className="content">{courseList}</WrapDisplay>
      </ScrollDiv>
    </WrapAll>
  );
};

export default Courses;

const ScrollDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const WrapAll = styled.div`
  width: 100%;
  height: 85vh;
  display: flex;
  flex: 1;
  overflow: auto;
  margin: 0;
`;

const WrapDisplay = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: center; */
  flex-wrap: wrap;
  margin: 1em 1em 1em 1em;
  padding: 0;
  //transition: 150ms ease-in-out;

  @media only screen and (max-width: 650px) {
    justify-content: center;
  }
`;
